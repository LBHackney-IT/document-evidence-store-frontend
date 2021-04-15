import Layout from '../../../components/ResidentLayout';
import Panel from '../../../components/Panel';
import Head from 'next/head';
import { NextPage } from 'next';
import { EvidenceApiGateway } from 'src/gateways/evidence-api';
import { withAuth } from 'src/helpers/authed-server-side-props';
import { TeamHelper } from '../../../services/team-helper';
import { Team } from 'src/domain/team';

type ConfirmationProps = {
  residentReferenceId: string;
  team: Team;
};

const Confirmation: NextPage<ConfirmationProps> = ({
  residentReferenceId,
  team,
}) => {
  return (
    <Layout>
      <Head>
        <title>Confirmation</title>
      </Head>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <Panel>
            <h1 className="lbh-heading-h1">We've received your documents</h1>
            <p className="lbh-body">
              Your reference number: {residentReferenceId}
            </p>
          </Panel>

          {/* <p className="lbh-body">We have sent you a confirmation email.</p> */}

          <h2 className="lbh-heading-h2">What happens next</h2>
          <p className="lbh-body">{team.slaMessage}</p>
          <p className="lbh-body">
            We’ve sent your evidence to the service that requested it. They will
            be in touch about the next steps.
          </p>
          <p className="lbh-body">
            <a
              href={process.env.FEEDBACK_FORM_URL}
              className="govuk-link lbh-link"
            >
              What did you think of this service?
            </a>{' '}
            (takes 30 seconds)
          </p>
        </div>
      </div>
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
  const residentReferenceId = evidenceRequest.resident.referenceId;

  const teamName = evidenceRequest.serviceRequestedBy;
  const team = TeamHelper.getTeamByName(TeamHelper.getTeamsJson(), teamName);

  return { props: { residentReferenceId, team } };
});

export default Confirmation;
