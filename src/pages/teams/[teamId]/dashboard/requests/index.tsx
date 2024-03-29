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
  feedbackUrl: string;
};

const RequestsIndexPage: NextPage<WithUser<RequestsIndexPageProps>> = ({
  evidenceRequests,
  teamId,
  feedbackUrl,
}) => {
  return (
    <Layout teamId={teamId} feedbackUrl={feedbackUrl}>
      <Head>
        <title>
          Pending requests | Document Evidence Service | Hackney Council
        </title>
      </Head>
      <h1 data-testid="pending-requests-h1" className="lbh-heading-h2">
        Pending requests
      </h1>

      <Link href={`/teams/${teamId}/dashboard/requests/new/1`}>
        <a className="govuk-button lbh-button">Make new request</a>
      </Link>
      <EvidenceRequestTable requests={evidenceRequests} />
    </Layout>
  );
};

export const getServerSideProps = withAuth<RequestsIndexPageProps>(
  async (ctx) => {
    const { teamId } = ctx.query as {
      teamId: string;
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
    const evidenceRequests = await gateway.getEvidenceRequests(
      user.email,
      team.name,
      null,
      EvidenceRequestState.PENDING
    );
    return {
      props: { evidenceRequests, teamId, feedbackUrl },
    };
  }
);

export default RequestsIndexPage;
