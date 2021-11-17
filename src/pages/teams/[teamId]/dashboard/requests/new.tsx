import { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import Layout from 'src/components/DashboardLayout';
import { EvidenceApiGateway } from 'src/gateways/evidence-api';
import { withAuth, WithUser } from 'src/helpers/authed-server-side-props';
import NewRequestForm from '../../../../../components/NewRequestForm';
import { DocumentType } from '../../../../../domain/document-type';
import { RequestAuthorizer } from '../../../../../services/request-authorizer';
import { TeamHelper } from '../../../../../services/team-helper';
import { Team } from '../../../../../domain/team';
import { User } from '../../../../../domain/user';

type RequestsNewPageProps = {
  documentTypes: DocumentType[];
  team: Team;
  user: User;
};

const RequestsNewPage: NextPage<WithUser<RequestsNewPageProps>> = ({
  documentTypes,
  team,
}) => {
  const [complete, setComplete] = useState(false);

  // const handleSubmit = useCallback(async (values: EvidenceRequestRequest) => {
  //   const gateway = new InternalApiGateway();
  //   const payload: EvidenceRequestRequest = {
  //     ...values,
  //     userRequestedBy: user.email,
  //     notificationEmail: user.email,
  //   };
  //   await gateway.createEvidenceRequest(user.email, payload);
  //   setComplete(true);
  // }, []);
  
  const handleContinue = () => {
    sethandleContinue(true);
  };
  
   const [acceptContinue, sethandleContinue] =useState(false);

  return (
    <Layout teamId={team.id}>
      <Head>
        <title>
          Make a new request | Document Evidence Service | Hackney Council
        </title>
      </Head>
      <h1 className="lbh-heading-h2">Make a new request</h1>
      {complete ? (
        <p className="lbh-body">Thanks!</p>
      ) : (
        <NewRequestForm
          documentTypes={documentTypes}
          team={team}
          // onContinue={handleContinue}
          // onSubmit={handleSubmit}
          redirect={`/teams/${team}/dashboard/requests/documentType`}
        />
      )}
    </Layout>
  );
};

// {
//   AcceptContinue && (
//     <DocumentTypeForm
//     redirect={`/teams/${teamId}/dashboard/residents/${residentId}`}
//   />
//   )

// }

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
    if (!userAuthorizedToViewTeam || team === undefined || user === undefined) {
      return {
        redirect: {
          destination: '/teams',
          permanent: false,
        },
      };
    }

    const gateway = new EvidenceApiGateway();
    const documentTypes = await gateway.getDocumentTypes(user.email, team.name);
    return { props: { documentTypes, team, user } };
  }
);

export default RequestsNewPage;
