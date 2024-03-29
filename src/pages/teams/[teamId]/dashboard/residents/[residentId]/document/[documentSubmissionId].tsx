import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import AcceptDialog from 'src/components/AcceptDialog';
import History from 'src/components/History';
import Layout from 'src/components/DashboardLayout';
import RejectDialog from 'src/components/RejectDialog';
import {
  DocumentState,
  DocumentSubmission,
} from 'src/domain/document-submission';
import { Resident } from 'src/domain/resident';
import { DocumentsApiGateway } from 'src/gateways/documents-api';
import { EvidenceApiGateway } from 'src/gateways/evidence-api';
import { withAuth, WithUser } from 'src/helpers/authed-server-side-props';
import styles from 'src/styles/Document.module.scss';
import { RequestAuthorizer } from '../../../../../../../services/request-authorizer';
import { TeamHelper } from '../../../../../../../services/team-helper';
import { DocumentType } from '../../../../../../../domain/document-type';
import { User } from '../../../../../../../domain/user';
import PageWarning from 'src/components/PageWarning';
import { DateTime } from 'luxon';
import ImagePreview from '../../../../../../../components/ImagePreview';

type DocumentDetailPageQuery = {
  residentId: string;
  documentSubmissionId: string;
};

type DocumentDetailPageProps = {
  teamId: string;
  user: User;
  resident: Resident;
  documentSubmission: DocumentSubmission;
  staffSelectedDocumentTypes: DocumentType[];
  downloadUrl: string;
  feedbackUrl: string;
};

const DocumentDetailPage: NextPage<WithUser<DocumentDetailPageProps>> = ({
  teamId,
  user,
  resident,
  documentSubmission: _documentSubmission,
  staffSelectedDocumentTypes,
  downloadUrl,
  feedbackUrl,
}) => {
  const router = useRouter();
  const {
    residentId,
    documentSubmissionId,
  } = router.query as DocumentDetailPageQuery;
  const documentSubmission = _documentSubmission;
  const [isClicked, setIsClicked] = useState(false);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const documentTypeTitle = documentSubmission.staffSelectedDocumentType
    ? documentSubmission.staffSelectedDocumentType.title
    : documentSubmission.documentType?.title ?? 'No title';

  async function copyPageUrl() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setButtonClicked();
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  const handleOpenAcceptDialog = () => {
    setAcceptDialogOpen(true);
  };

  const handleCloseAcceptDialog = () => {
    setAcceptDialogOpen(false);
  };

  const handleOpenRejectDialog = () => {
    setRejectDialogOpen(true);
  };

  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
  };

  function setButtonClicked() {
    setIsClicked(true);
  }

  return (
    <Layout teamId={teamId} feedbackUrl={feedbackUrl}>
      <Head>
        <title>
          {documentTypeTitle} | {resident.name} | Document Evidence Service |
          Hackney Council
        </title>
      </Head>

      {documentSubmission.claimValidUntil < DateTime.local() && (
        <PageWarning
          title="This document is no longer valid"
          content="If you need to use this document to prove eligibility, request a new
                  version from the resident."
        />
      )}

      <h1 className="lbh-heading-h2">
        <Link href={`/teams/${teamId}/dashboard/residents/${residentId}`}>
          <a className="lbh-link">{resident.name}</a>
        </Link>
        <img src="/divider.svg" alt="" className="lbu-divider" />
        {documentTypeTitle}
      </h1>

      {documentSubmission.state === DocumentState.UPLOADED && (
        <div className={styles.actions}>
          <button
            className="govuk-button lbh-button"
            onClick={handleOpenAcceptDialog}
          >
            Accept
          </button>
          <button
            className="govuk-button govuk-secondary lbh-button lbh-button--secondary"
            onClick={handleOpenRejectDialog}
          >
            Request new file
          </button>
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

      <div>
        <h2 className="lbh-heading-h3">Preview</h2>
        <ImagePreview
          documentSubmission={documentSubmission}
          downloadUrl={downloadUrl}
        />
      </div>

      <div>
        <h2 className="lbh-heading-h3">History</h2>
        <History documentSubmission={documentSubmission} resident={resident} />
      </div>

      {acceptDialogOpen && (
        <AcceptDialog
          open={acceptDialogOpen}
          staffSelectedDocumentTypes={staffSelectedDocumentTypes}
          onDismiss={handleCloseAcceptDialog}
          email={user.email}
          documentSubmissionId={documentSubmissionId}
          redirect={`/teams/${teamId}/dashboard/residents/${residentId}`}
        />
      )}

      <RejectDialog
        open={rejectDialogOpen}
        onDismiss={handleCloseRejectDialog}
        email={user.email}
        documentSubmissionId={documentSubmissionId}
        redirect={`/teams/${teamId}/dashboard/residents/${residentId}`}
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

  const feedbackUrl = process.env.FEEDBACK_FORM_STAFF_URL as string;

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
    team.name,
    true
  );
  const resident = await evidenceApiGateway.getResident(user.email, residentId);

  let downloadUrl = '';
  if (documentSubmission && documentSubmission.claimId) {
    downloadUrl = await documentsApiGateway.getDocumentPreSignedUrl(
      documentSubmission.claimId
    );
  }
  return {
    props: {
      teamId,
      user,
      resident,
      documentSubmission,
      staffSelectedDocumentTypes,
      downloadUrl,
      feedbackUrl,
    },
  };
});

export default DocumentDetailPage;
