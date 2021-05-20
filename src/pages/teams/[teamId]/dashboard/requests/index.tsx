import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from 'src/components/DashboardLayout';
import { EvidenceRequestState } from 'src/domain/enums/EvidenceRequestState';
import { EvidenceRequest } from 'src/domain/evidence-request';
import { EvidenceApiGateway } from 'src/gateways/evidence-api';
import { withAuth, WithUser } from 'src/helpers/authed-server-side-props';
import { EvidenceRequestTable } from '../../../../../components/EvidenceRequestTable';
import { RequestAuthorizer } from '../../../../../services/request-authorizer';
import { TeamHelper } from '../../../../../services/team-helper';

type RequestsIndexPageProps = {
  evidenceRequests: EvidenceRequest[];
  teamId: string;
};

const RequestsIndexPage: NextPage<WithUser<RequestsIndexPageProps>> = ({
  evidenceRequests,
  teamId,
}) => {
  return (
    <Layout teamId={teamId}>
      <Head>
        <title>Pending requests</title>
      </Head>
      <h1 className="lbh-heading-h2">Pending requests</h1>
      <EvidenceRequestTable requests={evidenceRequests} />
      <Link href={`/teams/${teamId}/dashboard/requests/new`}>
        <a className="govuk-button lbh-button">New request</a>
      </Link>
    </Layout>
  );
};

export const getServerSideProps = withAuth<RequestsIndexPageProps>(
  async (ctx) => {
    const { teamId } = ctx.query as {
      teamId: string;
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

    const gateway = new EvidenceApiGateway();
    const evidenceRequests = await gateway.getEvidenceRequests(
      user.email,
      team.name,
      EvidenceRequestState.PENDING
    );
    return {
      props: { evidenceRequests, teamId },
    };
  }
);

export default RequestsIndexPage;
