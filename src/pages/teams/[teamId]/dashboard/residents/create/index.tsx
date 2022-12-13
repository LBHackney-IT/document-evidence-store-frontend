import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import CreateResidentForm from 'src/components/CreateResidentForm';
import Layout from 'src/components/DashboardLayout';
import Head from 'next/head';
import { RequestAuthorizer } from 'src/services/request-authorizer';
import { withAuth, WithUser } from 'src/helpers/authed-server-side-props';
import { TeamHelper } from 'src/services/team-helper';
import { Resident } from 'src/domain/resident';
import { User } from '../../../../../../domain/user';

type CreatePageProps = {
  teamId: string;
  feedbackUrl: string;
  user: User;
};

const CreateResidentPage: NextPage<WithUser<CreatePageProps>> = ({
  feedbackUrl,
  teamId,
  user,
}) => {
  const router = useRouter();

  const onSuccess = (newResident: Resident): void => {
    router.push(`/teams/${teamId}/dashboard/residents/${newResident.id}`);
  };

  return (
    <>
      <Layout teamId={teamId} feedbackUrl={feedbackUrl}>
        <Head>
          <title>
            Create A Resident | Document Evidence Service | Hackney Council
          </title>
        </Head>
        <CreateResidentForm onSuccess={onSuccess} userEmail={user.email} />
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
  if (!userAuthorizedToViewTeam || team === undefined || user === undefined) {
    return {
      redirect: {
        destination: '/teams',
        permanent: false,
      },
    };
  }

  return {
    props: { teamId, feedbackUrl, user },
  };
});

export default CreateResidentPage;
