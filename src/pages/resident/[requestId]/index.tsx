import Layout from '../../../components/ResidentLayout';
import InterruptionCard from '../../../components/InterruptionCard';
import Link from 'next/link';
import Head from 'next/head';
import { withAuth } from '../../../helpers/authed-server-side-props';
import { EvidenceApiGateway } from '../../../gateways/evidence-api';
import { TeamHelper } from '../../../services/team-helper';
import { Team } from '../../../domain/team';
import { NextPage } from 'next';

type IndexProps = {
  requestId: string;
  team: Team;
};

const Index: NextPage<IndexProps> = ({ requestId, team }) => {
  return (
    <Layout feedbackUrl={process.env.FEEDBACK_FORM_RESIDENT_URL as string}>
      <Head>
        <title>You’ll need to photograph your documents</title>
      </Head>
      <InterruptionCard>
        <h1 className="lbh-heading-h1">
          You’ll need to photograph your documents
        </h1>
        <p className="lbh-body">
          You can use your smartphone camera. First, make sure you’re in a
          well-lit place.
        </p>
        <p className="lbh-body">
          Lie the document flat and try not to cover any part of it.
        </p>
        <p className="lbh-body">
          Make sure the whole document is in the frame.
        </p>
        <p className="lbh-body">{team.landingMessage}</p>
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
    requestId
  );

  const teamName = evidenceRequest.serviceRequestedBy;
  const team = TeamHelper.getTeamByName(TeamHelper.getTeamsJson(), teamName);

  return { props: { requestId, team } };
});

export default Index;
