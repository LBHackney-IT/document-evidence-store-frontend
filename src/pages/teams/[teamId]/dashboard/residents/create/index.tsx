import React, { useCallback } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import CreateResidentForm from 'src/components/CreateResidentForm';
import Layout from 'src/components/DashboardLayout';
import Head from 'next/head';
import { RequestAuthorizer } from 'src/services/request-authorizer';
import { withAuth, WithUser } from 'src/helpers/authed-server-side-props';
import { TeamHelper } from 'src/services/team-helper';
import { User } from '../../../../../../domain/user';
import {
  CreateResidentRequest,
  InternalApiGateway,
} from 'src/gateways/internal-api';

type CreatePageProps = {
  teamId: string;
  teamName: string;
  feedbackUrl: string;
  user: User;
};

const CreateResidentPage: NextPage<WithUser<CreatePageProps>> = ({
  feedbackUrl,
  teamId,
  teamName,
  user,
}) => {
  const router = useRouter();

  const createResident = useCallback(
    async (resident: CreateResidentRequest): Promise<void> => {
      const gateway = new InternalApiGateway();
      const newResident = await gateway.createResident(
        user.email,
        teamName,
        resident
      );
      router.push(`/teams/${teamId}/dashboard/residents/${newResident.id}`);
    },
    []
  );

  return (
    <>
      <Layout teamId={teamId} feedbackUrl={feedbackUrl}>
        <Head>
          <title>
            Create A Resident | Document Evidence Service | Hackney Council
          </title>
        </Head>
        <CreateResidentForm
          createResident={createResident}
          initialValues={{ name: '', phone: '', email: '' }}
        />
      </Layout>
    </>
  );
};

export const getServerSideProps = withAuth<CreatePageProps>(async (ctx) => {
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
  const teamName = team?.name ? team.name : '';
  if (!userAuthorizedToViewTeam || team === undefined || user === undefined) {
    return {
      redirect: {
        destination: '/teams',
        permanent: false,
      },
    };
  }

  return {
    props: { teamId, teamName, feedbackUrl, user },
  };
});

export default CreateResidentPage;
