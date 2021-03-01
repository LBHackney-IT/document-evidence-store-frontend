import { Paragraph } from 'lbh-frontend-react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useCallback, useState } from 'react';
import Layout from 'src/components/DashboardLayout';
import { EvidenceApiGateway } from 'src/gateways/evidence-api';
import { withAuth, WithUser } from 'src/helpers/authed-server-side-props';
import NewRequestForm from '../../../../../components/NewRequestForm';
import { DocumentType } from '../../../../../domain/document-type';
import {
  EvidenceRequestRequest,
  InternalApiGateway,
} from '../../../../../gateways/internal-api';
import { RequestAuthorizer } from '../../../../../services/request-authorizer';
import { TeamHelper } from '../../../../../services/team-helper';
import { Team } from '../../../../../domain/team';

type RequestsNewPageProps = {
  documentTypes: DocumentType[];
  team: Team;
};

const RequestsNewPage: NextPage<WithUser<RequestsNewPageProps>> = ({
  documentTypes,
  team,
  user,
}) => {
  const [complete, setComplete] = useState(false);

  const handleSubmit = useCallback(async (values: EvidenceRequestRequest) => {
    const gateway = new InternalApiGateway();
    const payload: EvidenceRequestRequest = {
      ...values,
      userRequestedBy: user?.email,
    };
    await gateway.createEvidenceRequest(payload);
    setComplete(true);
  }, []);

  return (
    <Layout teamId={team.id}>
      <Head>
        <title>Make a new request</title>
      </Head>
      <h1 className="lbh-heading-h2">Make a new request</h1>
      {complete ? (
        <Paragraph>Thanks!</Paragraph>
      ) : (
        <NewRequestForm
          documentTypes={documentTypes}
          onSubmit={handleSubmit}
          team={team}
        />
      )}
    </Layout>
  );
};

export const getServerSideProps = withAuth<RequestsNewPageProps>(
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
    if (!userAuthorizedToViewTeam || team === undefined) {
      return {
        redirect: {
          destination: '/teams',
          permanent: false,
        },
      };
    }

    const gateway = new EvidenceApiGateway();
    const documentTypes = await gateway.getDocumentTypes();
    return { props: { documentTypes, team } };
  }
);

export default RequestsNewPage;
