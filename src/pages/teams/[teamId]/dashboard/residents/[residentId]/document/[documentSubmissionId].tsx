import { Button, ErrorMessage } from 'lbh-frontend-react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import AcceptDialog from 'src/components/AcceptDialog';
import Layout from 'src/components/DashboardLayout';
import RejectDialog from 'src/components/RejectDialog';
import {
  DocumentState,
  DocumentSubmission,
} from 'src/domain/document-submission';
import { Resident } from 'src/domain/resident';
import { DocumentsApiGateway } from 'src/gateways/documents-api';
import { EvidenceApiGateway } from 'src/gateways/evidence-api';
import {
  DocumentSubmissionRequest,
  InternalApiGateway,
} from 'src/gateways/internal-api';
import { withAuth, WithUser } from 'src/helpers/authed-server-side-props';
import { humanFileSize } from 'src/helpers/formatters';
import styles from 'src/styles/Document.module.scss';
import { RequestAuthorizer } from '../../../../../../../services/request-authorizer';
import { TeamHelper } from '../../../../../../../services/team-helper';
import { DocumentType } from '../../../../../../../domain/document-type';

const gateway = new InternalApiGateway();

type DocumentDetailPageQuery = {
  residentId: string;
  documentSubmissionId: string;
  action?: string;
};

type DocumentDetailPageProps = {
  teamId: string;
  resident: Resident;
  documentSubmission: DocumentSubmission;
  staffSelectedDocumentTypes: DocumentType[];
  downloadUrl: string;
};

const DocumentDetailPage: NextPage<WithUser<DocumentDetailPageProps>> = ({
  teamId,
  resident,
  documentSubmission: _documentSubmission,
  staffSelectedDocumentTypes,
  downloadUrl,
}) => {
  const router = useRouter();
  const {
    residentId,
    documentSubmissionId,
    action,
  } = router.query as DocumentDetailPageQuery;
  const [documentSubmission, setDocumentSubmission] = useState(
    _documentSubmission
  );

  const handleAccept = useCallback(
    async (values: DocumentSubmissionRequest) => {
      try {
        const updated = await gateway.updateDocumentSubmission(
          documentSubmissionId,
          {
            state: values.state,
            staffSelectedDocumentTypeId: values.staffSelectedDocumentTypeId,
          }
        );
        setDocumentSubmission(updated);
        router.push(
          `/teams/${teamId}/dashboard/residents/${residentId}`,
          undefined,
          { shallow: true }
        );
      } catch (err) {
        console.error(err);
        setSubmitError(true);
      }
    },
    [documentSubmission]
  );
  const [submitError, setSubmitError] = useState(false);

  const { document } = documentSubmission;
  if (!document) return null;

  return (
    <Layout teamId={teamId}>
      <Head>
        <title>
          {documentSubmission.documentType.title} | {resident.name}
        </title>
      </Head>

      <h1 className="lbh-heading-h2">
        <Link href={`/teams/${teamId}/dashboard/residents/${residentId}`}>
          <a className="lbh-link">{resident.name}</a>
        </Link>
        <img src="/divider.svg" alt="" className="lbu-divider" />
        {documentSubmission.documentType.title}
      </h1>

      {submitError && (
        <ErrorMessage>There was an error. Please try again later</ErrorMessage>
      )}

      {documentSubmission.state === DocumentState.UPLOADED && (
        <div className={styles.actions}>
          <Link
            href={`/teams/${teamId}/dashboard/residents/${residentId}/document/${documentSubmission.id}?action=accept`}
            scroll={false}
          >
            <Button>Accept</Button>
          </Link>
          <Link
            href={`/teams/${teamId}/dashboard/residents/${residentId}/document/${documentSubmission.id}?action=reject`}
            scroll={false}
          >
            <Button className="govuk-button--secondary lbh-button--secondary">
              Request new file
            </Button>
          </Link>
        </div>
      )}

      {document.extension === 'jpeg' || document.extension === 'png' ? (
        <>
          <h2 className="lbh-heading-h3">Preview</h2>
          <figure className={styles.preview}>
            <img src={downloadUrl} alt="example" />
            <figcaption className="lbh-body-s">
              <strong>{document.extension?.toUpperCase()}</strong>{' '}
              {humanFileSize(document.fileSizeInBytes)}{' '}
              <a href={`${downloadUrl}`} className="lbh-link">
                Download
              </a>
            </figcaption>
          </figure>
        </>
      ) : (
        <figcaption className="lbh-body-s">
          <strong>{document.extension?.toUpperCase()}</strong>{' '}
          {humanFileSize(document.fileSizeInBytes)}{' '}
          <a href={`${downloadUrl}`} className="lbh-link">
            Download
          </a>
        </figcaption>
      )}

      {/* https://hackney.atlassian.net/browse/DES-63 */}
      {/* <h2 className="lbh-heading-h3">History</h2> */}
      {/* <History /> */}

      <AcceptDialog
        open={action === 'accept'}
        staffSelectedDocumentTypes={staffSelectedDocumentTypes}
        onAccept={handleAccept}
        onDismiss={() =>
          router.push(
            `/teams/${teamId}/dashboard/residents/${residentId}/document/${documentSubmissionId}`
          )
        }
      />

      <RejectDialog
        open={action === 'reject'}
        onReject={() => {
          // handle reject here
        }}
        onDismiss={() =>
          router.push(
            `/teams/${teamId}/dashboard/residents/${residentId}/document/${documentSubmissionId}`
          )
        }
      />
    </Layout>
  );
};

export const getServerSideProps = withAuth(async (ctx) => {
  const evidenceApiGateway = new EvidenceApiGateway();
  const documentsApiGateway = new DocumentsApiGateway();
  const { teamId, residentId, documentSubmissionId } = ctx.params as {
    teamId: string;
    residentId: string;
    documentSubmissionId: string;
  };

  const user = new RequestAuthorizer().authoriseUser(ctx.req?.headers.cookie);
  const userAuthorizedToViewTeam = TeamHelper.userAuthorizedToViewTeam(
    TeamHelper.getTeamsJson(),
    user,
    teamId
  );

  const team = TeamHelper.getTeamFromId(TeamHelper.getTeamsJson(), teamId);
  if (!userAuthorizedToViewTeam || team === undefined) {
    return {
      redirect: {
        destination: '/teams',
        permanent: false,
      },
    };
  }
  const documentSubmission = await evidenceApiGateway.getDocumentSubmission(
    documentSubmissionId
  );
  const staffSelectedDocumentTypes = await evidenceApiGateway.getStaffSelectedDocumentTypes(
    team.name
  );
  const resident = await evidenceApiGateway.getResident(residentId);

  let downloadUrl = '';
  if (documentSubmission && documentSubmission.document) {
    downloadUrl = await documentsApiGateway.generateDownloadUrl(
      documentSubmission.claimId,
      documentSubmission.document.id
    );
  }
  return {
    props: {
      teamId,
      resident,
      documentSubmission,
      staffSelectedDocumentTypes,
      downloadUrl,
    },
  };
});

export default DocumentDetailPage;
