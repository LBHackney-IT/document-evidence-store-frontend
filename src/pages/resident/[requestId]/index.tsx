import Layout from '../../../components/ResidentLayout';
import InterruptionCard from '../../../components/InterruptionCard';
import Link from 'next/link';
import Head from 'next/head';
import { withAuth } from '../../../helpers/authed-server-side-props';
import { EvidenceApiGateway } from '../../../gateways/evidence-api';
import { TeamHelper } from '../../../services/team-helper';
import { Team } from '../../../domain/team';
import { NextPage } from 'next';
import { Constants } from '../../../helpers/Constants';
import { stringToMarkup } from '../../../helpers/formatters';

type IndexProps = {
  requestId: string;
  team: Team;
};

const Index: NextPage<IndexProps> = ({ requestId, team }) => {
  return (
    <Layout feedbackUrl={process.env.FEEDBACK_FORM_RESIDENT_URL as string}>
      <Head>
        <title>
          Please have your documents ready | Document Evidence Service | Hackney
          Council
        </title>
      </Head>
      <InterruptionCard>
        <h1 className="lbh-heading-h1">Please have your documents ready</h1>
        <p
          className="lbh-body"
          dangerouslySetInnerHTML={stringToMarkup(team.landingMessage)}
        ></p>
        <Link href={`/resident/${requestId}/upload`}>
          <a className="govuk-button lbh-button">Continue</a>
        </Link>
      </InterruptionCard>
    </Layout>
  );
};

export const getServerSideProps = withAuth(async (ctx) => {
  const { requestId } = ctx.query as {
    requestId: string;
  };
  const evidenceApiGateway = new EvidenceApiGateway();
  const evidenceRequest = await evidenceApiGateway.getEvidenceRequest(
    Constants.DUMMY_EMAIL,
    requestId
  );

  const teamName = evidenceRequest.team;
  const team = TeamHelper.getTeamByName(TeamHelper.getTeamsJson(), teamName);

  return { props: { requestId, team } };
});

export default Index;
