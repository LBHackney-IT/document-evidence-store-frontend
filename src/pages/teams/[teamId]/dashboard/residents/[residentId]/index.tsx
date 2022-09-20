import { NextPage } from 'next';
import Layout from 'src/components/DashboardLayout';
import { DocumentSubmission } from 'src/domain/document-submission';
import { EvidenceApiGateway } from 'src/gateways/evidence-api';
import { Resident } from 'src/domain/resident';
import { withAuth, WithUser } from 'src/helpers/authed-server-side-props';
import { RequestAuthorizer } from '../../../../../../services/request-authorizer';
import { TeamHelper } from '../../../../../../services/team-helper';
import React from 'react';
import ResidentDetailsTable from '../../../../../../components/ResidentDetailsTable';
import Link from 'next/link';
import Head from 'next/head';
import { EvidenceRequestState } from 'src/domain/enums/EvidenceRequestState';
import { EvidenceRequest } from 'src/domain/evidence-request';
import { ResidentDocumentsTable } from '../../../../../../components/ResidentDocumentsTable';
import { useRouter } from 'next/router';

type ResidentPageProps = {
  evidenceRequests: EvidenceRequest[];
  documentSubmissions: DocumentSubmission[];
  resident: Resident;
  teamId: string;
  feedbackUrl: string;
};

const router = useRouter();
const { residentId } = router.query as {
  residentId: string;
};

const ResidentPage: NextPage<WithUser<ResidentPageProps>> = ({
  evidenceRequests,
  documentSubmissions,
  resident,
  teamId,
  feedbackUrl,
}) => {
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
      <ResidentDocumentsTable
        evidenceRequests={evidenceRequests}
        documentSubmissions={documentSubmissions}
        teamId={teamId}
        residentId={residentId}
      />
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
  const documentSubmissionsPromise = gateway.getDocumentSubmissionsForResident(
    user.email,
    team.name,
    residentId
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
    documentSubmissions,
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
      documentSubmissions,
      resident,
      teamId,
      feedbackUrl,
    },
  };
});

export default ResidentPage;
