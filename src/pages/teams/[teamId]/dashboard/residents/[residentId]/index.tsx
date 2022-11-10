import { NextPage } from 'next';
import Layout from 'src/components/DashboardLayout';
import { Pagination } from 'src/components/Pagination';
import { DocumentSubmission } from 'src/domain/document-submission';
import { EvidenceApiGateway } from 'src/gateways/evidence-api';
import { Resident } from 'src/domain/resident';
import { withAuth, WithUser } from 'src/helpers/authed-server-side-props';
import { RequestAuthorizer } from '../../../../../../services/request-authorizer';
import { TeamHelper } from '../../../../../../services/team-helper';
import React, { useState, useEffect } from 'react';
import ResidentDetailsTable from '../../../../../../components/ResidentDetailsTable';
import Link from 'next/link';
import Head from 'next/head';
import { EvidenceRequestState } from 'src/domain/enums/EvidenceRequestState';
import { EvidenceRequest } from 'src/domain/evidence-request';
import { ResidentDocumentsTable } from '../../../../../../components/ResidentDocumentsTable';
import {
  ResidentPageContext,
  UserContextInterface,
} from '../../../../../../contexts/ResidentPageContext';

let teamName: string | undefined;
let userEmail: string | undefined;

type ResidentPageProps = {
  evidenceRequests: EvidenceRequest[];
  documentSubmissions: DocumentSubmission[];
  total: number;
  resident: Resident;
  teamId: string;
  feedbackUrl: string;
};

const ResidentPage: NextPage<WithUser<ResidentPageProps>> = ({
  evidenceRequests,
  documentSubmissions,
  total,
  resident,
  teamId,
  feedbackUrl,
}) => {
  const contextToPass: UserContextInterface = {
    residentIdContext: resident.id,
    teamIdContext: teamId,
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [
    displayedDocumentSubmissions,
    setDisplayedDocumentSubmissions,
  ] = useState<DocumentSubmission[]>(documentSubmissions);

  const onPageChange = async (targetPage: number) => {
    setCurrentPage(targetPage);
    const gateway = new EvidenceApiGateway();
    const pageSize = 10;

    const documentSubmissionPromise = await gateway.getDocumentSubmissionsForResident(
      userEmail ?? '',
      teamName ?? '',
      resident.id,
      targetPage,
      pageSize
    );

    setDisplayedDocumentSubmissions(
      documentSubmissionPromise.documentSubmissions
    );

    return null;
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
      <ResidentPageContext.Provider value={contextToPass}>
        <ResidentDocumentsTable
          evidenceRequests={evidenceRequests}
          documentSubmissions={displayedDocumentSubmissions}
        />
        <Pagination
          currentPageNumber={currentPage}
          pageSize={10}
          total={total}
          onPageChange={onPageChange}
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

  //hoist email into global scope
  userEmail = user?.email;

  const userAuthorizedToViewTeam = TeamHelper.userAuthorizedToViewTeam(
    TeamHelper.getTeamsJson(),
    user,
    teamId
  );

  const team = TeamHelper.getTeamFromId(TeamHelper.getTeamsJson(), teamId);

  //hoist teamname into global scope
  teamName = team?.name;

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
    team.name,
    residentId,
    initialPage,
    pageLimit
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

  return {
    props: {
      evidenceRequests,
      documentSubmissions: documentSubmissionsObject.documentSubmissions,
      total: documentSubmissionsObject.total,
      resident,
      teamId,
      feedbackUrl,
    },
  };
});

export default ResidentPage;
