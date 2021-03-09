import { Button } from 'lbh-frontend-react';
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
import { DocumentsApiGateway } from 'src/gateways/documents-api';
import { EvidenceApiGateway } from 'src/gateways/evidence-api';
import { InternalApiGateway } from 'src/gateways/internal-api';
import { withAuth, WithUser } from 'src/helpers/authed-server-side-props';
import { humanFileSize } from 'src/helpers/formatters';
import styles from 'src/styles/Document.module.scss';
import { RequestAuthorizer } from '../../../../../../../services/request-authorizer';
import { TeamHelper } from '../../../../../../../services/team-helper';

const gateway = new InternalApiGateway();

type DocumentDetailPageQuery = {
  residentId: string;
  documentSubmissionId: string;
  action?: string;
};

type DocumentDetailPageProps = {
  documentSubmission: DocumentSubmission;
  teamId: string;
  downloadUrl: string;
};

const DocumentDetailPage: NextPage<WithUser<DocumentDetailPageProps>> = ({
  documentSubmission: _documentSubmission,
  teamId,
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

  const handleAccept = useCallback(async () => {
    const updated = await gateway.updateDocumentSubmission(
      documentSubmissionId,
      {
        state: DocumentState.APPROVED,
      }
    );
    setDocumentSubmission(updated);
    router.push(
      `/teams/${teamId}/dashboard/residents/${residentId}/document/${documentSubmission.id}`,
      undefined,
      { shallow: true }
    );
  }, [documentSubmission]);

  const { document } = documentSubmission;
  if (!document) return null;

  return (
    <Layout teamId={teamId}>
      <Head>
        <title>
          {documentSubmission.documentType.title} | Firstname Surname
        </title>
      </Head>

      <h1 className="lbh-heading-h2">
        <Link href={`/teams/${teamId}/dashboard/residents/${residentId}`}>
          <a className="lbh-link">Firstname Surname</a>
        </Link>
        <img src="/divider.svg" alt="" className="lbu-divider" />
        {documentSubmission.documentType.title}
      </h1>

      {documentSubmission.state === DocumentState.PENDING && (
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

      <h2 className="lbh-heading-h3">Preview</h2>

      <figure className={styles.preview}>
        <img src="http://placehold.it/600x400" alt="example" />
        <figcaption className="lbh-body-s">
          <strong>{document.extension?.toUpperCase()}</strong>{' '}
          {humanFileSize(document.fileSizeInBytes)}{' '}
          <a href={`${downloadUrl}`} className="lbh-link">
            Download
          </a>
        </figcaption>
      </figure>

      {/* https://hackney.atlassian.net/browse/DES-63 */}
      {/* <h2 className="lbh-heading-h3">History</h2> */}
      {/* <History /> */}

      <AcceptDialog
        open={action === 'accept'}
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
  const { teamId, documentSubmissionId } = ctx.params as {
    teamId: string;
    documentSubmissionId: string;
  };

  const user = new RequestAuthorizer().authoriseUser(ctx.req?.headers.cookie);
  const userAuthorizedToViewTeam = TeamHelper.userAuthorizedToViewTeam(
    TeamHelper.getTeamsJson(),
    user,
    teamId
  );

  if (!userAuthorizedToViewTeam) {
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

  let downloadUrl = '';
  if (documentSubmission && documentSubmission.document) {
    downloadUrl = await documentsApiGateway.generateDownloadUrl(
      documentSubmission.claimId,
      documentSubmission.document.id
    );
  }
  return { props: { documentSubmission, teamId, downloadUrl } };
});

export default DocumentDetailPage;
