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
  DocumentSubmissionForm,
  InternalApiGateway,
} from 'src/gateways/internal-api';
import { withAuth, WithUser } from 'src/helpers/authed-server-side-props';
import { humanFileSize } from 'src/helpers/formatters';
import styles from 'src/styles/Document.module.scss';
import { RequestAuthorizer } from '../../../../../../../services/request-authorizer';
import { TeamHelper } from '../../../../../../../services/team-helper';
import { DocumentType } from '../../../../../../../domain/document-type';
import { User } from '../../../../../../../domain/user';

const gateway = new InternalApiGateway();

type DocumentDetailPageQuery = {
  residentId: string;
  documentSubmissionId: string;
  action?: string;
};

type DocumentDetailPageProps = {
  teamId: string;
  user: User;
  resident: Resident;
  documentSubmission: DocumentSubmission;
  staffSelectedDocumentTypes: DocumentType[];
  downloadUrl: string;
};

const DocumentDetailPage: NextPage<WithUser<DocumentDetailPageProps>> = ({
  teamId,
  user,
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
  const [isClicked, setIsClicked] = useState(false);

  const handleAccept = useCallback(
    async (values: DocumentSubmissionForm) => {
      try {
        const payload = buildAcceptDocumentSubmissionRequest(values);
        const updated = await gateway.updateDocumentSubmission(
          user.email,
          documentSubmissionId,
          payload
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

  const buildAcceptDocumentSubmissionRequest = (
    values: DocumentSubmissionForm
  ) => {
    if (values.validUntilDates && values.validUntilDates.length > 0) {
      return {
        state: values.state,
        staffSelectedDocumentTypeId: values.staffSelectedDocumentTypeId,
        validUntil: values.validUntilDates.join('-'),
      };
    } else {
      return {
        state: values.state,
        staffSelectedDocumentTypeId: values.staffSelectedDocumentTypeId,
      };
    }
  };

  const handleReject = useCallback(
    async (values: DocumentSubmissionForm) => {
      try {
        const updated = await gateway.updateDocumentSubmission(
          user.email,
          documentSubmissionId,
          {
            state: values.state,
            rejectionReason: values.rejectionReason,
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

  const documentTypeTitle = documentSubmission.staffSelectedDocumentType
    ? documentSubmission.staffSelectedDocumentType.title
    : documentSubmission.documentType.title;

  async function copyPageUrl() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setButtonClicked();
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  function setButtonClicked() {
    setIsClicked(true);
  }

  return (
    <Layout teamId={teamId}>
      <Head>
        <title>
          {documentTypeTitle} | {resident.name}
        </title>
      </Head>

      <h1 className="lbh-heading-h2">
        <Link href={`/teams/${teamId}/dashboard/residents/${residentId}`}>
          <a className="lbh-link">{resident.name}</a>
        </Link>
        <img src="/divider.svg" alt="" className="lbu-divider" />
        {documentTypeTitle}
      </h1>

      {submitError && (
        <span className="govuk-error-message lbh-error-message">
          There was an error. Please try again later.
        </span>
      )}

      {documentSubmission.state === DocumentState.UPLOADED && (
        <div className={styles.actions}>
          <Link
            href={`/teams/${teamId}/dashboard/residents/${residentId}/document/${documentSubmission.id}?action=accept`}
            scroll={false}
          >
            <button className="govuk-button lbh-button">Accept</button>
          </Link>
          <Link
            href={`/teams/${teamId}/dashboard/residents/${residentId}/document/${documentSubmission.id}?action=reject`}
            scroll={false}
          >
            <button className="govuk-button govuk-secondary lbh-button lbh-button--secondary">
              Request new file
            </button>
          </Link>
        </div>
      )}

      {documentSubmission.state === DocumentState.APPROVED && (
        <button
          onClick={copyPageUrl}
          className="govuk-button govuk-secondary lbh-button lbh-button--secondary"
          aria-live="polite"
        >
          {!isClicked ? 'Copy page URL' : 'Copied'}
        </button>
      )}

      {document.extension === 'jpeg' || document.extension === 'png' ? (
        <>
          <h2 className="lbh-heading-h3">Preview</h2>
          <figure className={styles.preview}>
            <img src={downloadUrl} alt="example" />
            <figcaption className="lbh-body-s">
              <strong>{document.extension?.toUpperCase()}</strong>{' '}
              {humanFileSize(document.fileSizeInBytes)}{' '}
              <a href={`${downloadUrl}`} target="blank" className="lbh-link">
                Open in new tab
              </a>
            </figcaption>
          </figure>
        </>
      ) : (
        <figcaption className="lbh-body-s">
          <strong>{document.extension?.toUpperCase()}</strong>{' '}
          {humanFileSize(document.fileSizeInBytes)}{' '}
          <a href={`${downloadUrl}`} target="blank" className="lbh-link">
            Open in new tab
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
        onReject={handleReject}
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
  if (!userAuthorizedToViewTeam || team === undefined || user === undefined) {
    return {
      redirect: {
        destination: '/teams',
        permanent: false,
      },
    };
  }
  const documentSubmission = await evidenceApiGateway.getDocumentSubmission(
    user.email,
    documentSubmissionId
  );
  const staffSelectedDocumentTypes = await evidenceApiGateway.getStaffSelectedDocumentTypes(
    user.email,
    team.name
  );
  const resident = await evidenceApiGateway.getResident(user.email, residentId);

  const downloadUrl = 'test';
  let document;
  if (documentSubmission && documentSubmission.document) {
    document = await documentsApiGateway.getDocument(
      documentSubmission.document.id
    );
  }
  console.log(document?.name);
  return {
    props: {
      teamId,
      user,
      resident,
      documentSubmission,
      staffSelectedDocumentTypes,
      downloadUrl,
    },
  };
});

export default DocumentDetailPage;
