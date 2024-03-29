import { NextPage } from 'next';
import Layout from 'src/components/DashboardLayout';
import { DocumentSubmission } from 'src/domain/document-submission';
import { EvidenceApiGateway } from 'src/gateways/evidence-api';
import { Resident } from 'src/domain/resident';
import { withAuth, WithUser } from 'src/helpers/authed-server-side-props';
import { RequestAuthorizer } from '../../../../../../services/request-authorizer';
import { TeamHelper } from '../../../../../../services/team-helper';
import React, { useState } from 'react';
import ResidentDetailsTable from '../../../../../../components/ResidentDetailsTable';
import Link from 'next/link';
import Head from 'next/head';
import { EvidenceRequestState } from 'src/domain/enums/EvidenceRequestState';
import { EvidenceRequest } from 'src/domain/evidence-request';
import {
  ResidentDocumentsTable,
  EvidenceAwaitingSubmission,
} from '../../../../../../components/ResidentDocumentsTable';

import {
  ResidentPageContext,
  UserContextInterface,
} from '../../../../../../contexts/ResidentPageContext';
import { DocumentSubmissionsModel } from 'src/services/get-document-submissions-model';
import { DocumentType } from 'src/domain/document-type';

type ResidentPageProps = {
  evidenceRequests: EvidenceRequest[];
  awaitingSubmissions: EvidenceAwaitingSubmission[];
  documentSubmissions: DocumentSubmission[];
  total: number;
  resident: Resident;
  state?: string;
  teamId: string;
  feedbackUrl: string;
  userEmail: string;
};

const ResidentPage: NextPage<WithUser<ResidentPageProps>> = ({
  evidenceRequests,
  awaitingSubmissions,
  documentSubmissions,
  userEmail,
  total,
  resident,
  teamId,
  feedbackUrl,
}) => {
  const contextToPass: UserContextInterface = {
    residentIdContext: resident.id,
    teamIdContext: teamId,
  };

  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(total);
  const [
    displayedDocumentSubmissions,
    setDisplayedDocumentSubmissions,
  ] = useState<DocumentSubmission[]>(documentSubmissions);

  const onPageOrTabChange = async (targetPage: number, state?: string) => {
    const team = TeamHelper.getTeamFromId(TeamHelper.getTeamsJson(), teamId);

    const model = new DocumentSubmissionsModel();
    try {
      const documentSubmissionPromise = await model.handleSubmit(
        userEmail,
        resident.id,
        team?.name ?? '',
        targetPage.toString(),
        pageSize.toString(),
        state !== 'all-documents' ? state : undefined
      );
      setDisplayedDocumentSubmissions(
        documentSubmissionPromise.documentSubmissions
      );
      setTotalPages(documentSubmissionPromise.total);
    } catch (e) {
      console.log(`ERROR - ERROR UPDATING DOC SUBMISSIONS ${e}`);
    }
  };

  return (
    <Layout teamId={teamId} feedbackUrl={feedbackUrl}>
      <Head>
        <title>
          {resident.name} | Document Evidence Service | Hackney Council
        </title>
      </Head>
      <h1 className="lbh-heading-h2">
        <Link href={`/teams/${teamId}/dashboard`}>
          <a className="lbh-link" data-testid="search-page">
            Search page
          </a>
        </Link>
        <img src="/divider.svg" alt="" className="lbu-divider" />
        {resident.name}
      </h1>
      <ResidentDetailsTable resident={resident} />
      <div>
        <Link
          href={`/teams/${teamId}/dashboard/residents/${resident.id}/upload`}
        >
          <a className="lbh-link" data-testid="upload-documents">
            Upload documents
          </a>
        </Link>
      </div>
      <ResidentPageContext.Provider value={contextToPass}>
        <ResidentDocumentsTable
          evidenceRequests={evidenceRequests}
          awaitingSubmissions={awaitingSubmissions}
          documentSubmissions={displayedDocumentSubmissions}
          total={totalPages}
          pageSize={pageSize}
          onPageOrTabChange={onPageOrTabChange}
        />
      </ResidentPageContext.Provider>
    </Layout>
  );
};

export const getServerSideProps = withAuth<ResidentPageProps>(async (ctx) => {
  const { teamId, residentId } = ctx.query as {
    teamId: string;
    residentId: string;
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

  const gateway = new EvidenceApiGateway();

  const initialPage = 1;
  const pageLimit = 10;

  const documentSubmissionsPromise = gateway.getDocumentSubmissionsForResident(
    user.email,
    residentId,
    team.name,
    initialPage.toString(),
    pageLimit.toString()
  );

  const pendingEvidenceRequestsPromise = gateway.getEvidenceRequests(
    user.email,
    team.name,
    residentId,
    EvidenceRequestState.PENDING
  );
  const forReviewEvidenceRequestsPromise = gateway.getEvidenceRequests(
    user.email,
    team.name,
    residentId,
    EvidenceRequestState.FOR_REVIEW
  );
  const residentPromise = gateway.getResident(user.email, residentId);

  const userEmail = user.email;

  const [
    documentSubmissionsObject,
    pendingEvidenceRequests,
    forReviewEvidenceRequests,
    resident,
  ] = await Promise.all([
    documentSubmissionsPromise,
    pendingEvidenceRequestsPromise,
    forReviewEvidenceRequestsPromise,
    residentPromise,
  ]);

  const evidenceRequests = pendingEvidenceRequests.concat(
    forReviewEvidenceRequests
  );

  const documentTypesMap = new Map<string, Set<DocumentType>>();
  evidenceRequests.forEach((er) =>
    documentTypesMap.set(er.id, new Set(er.documentTypes))
  );
  documentSubmissionsObject.documentSubmissions.forEach((ds) => {
    if (!ds.evidenceRequestId) {
      return;
    }
    const currentDocumentTypesSet = documentTypesMap.get(ds.evidenceRequestId);

    currentDocumentTypesSet?.forEach((dt) => {
      if (dt.id === ds.documentType?.id) {
        currentDocumentTypesSet.delete(dt);
      }
    });
  });

  const awaitingSubmissions: EvidenceAwaitingSubmission[] = [];
  documentTypesMap.forEach((value, key) => {
    value.forEach((dt) => {
      const evidenceRequestFromKey = evidenceRequests.find(
        (er) => er.id == key
      );
      awaitingSubmissions.push({
        documentType: dt.title,
        dateRequested: evidenceRequestFromKey?.createdAt,
        requestedBy: evidenceRequestFromKey?.userRequestedBy,
        reason: evidenceRequestFromKey?.reason,
      });
    });
  });

  return {
    props: {
      evidenceRequests,
      awaitingSubmissions,
      documentSubmissions: documentSubmissionsObject.documentSubmissions,
      total: documentSubmissionsObject.total,
      resident,
      teamId,
      feedbackUrl,
      userEmail,
    },
  };
});

export default ResidentPage;
