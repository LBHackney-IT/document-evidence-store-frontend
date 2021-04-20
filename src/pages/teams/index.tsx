import { Team } from '../../domain/team';
import { withAuth, WithUser } from '../../helpers/authed-server-side-props';
import { NextPage } from 'next';
import Head from 'next/head';
import { RequestAuthorizer } from '../../services/request-authorizer';
import { TeamHelper } from '../../services/team-helper';
import TeamsLayout from '../../components/TeamsLayout';
import TeamsList from '../../components/TeamsList';

type TeamsProps = {
  teams: Team[];
};

const Teams: NextPage<WithUser<TeamsProps>> = ({ teams }) => {
  return (
    <TeamsLayout>
      <Head>
        <title>Choose a team</title>
      </Head>

      <h1 className="lbh-heading-h1">Choose a team</h1>

      <TeamsList teams={teams} />
    </TeamsLayout>
  );
};

export const getServerSideProps = withAuth<TeamsProps>(async (ctx) => {
  const user = new RequestAuthorizer().authoriseUser(ctx.req?.headers.cookie);
  let userTeams: Team[];

  if (user == undefined) {
    userTeams = [];
  } else {
    userTeams = TeamHelper.filterTeamsForUser(TeamHelper.getTeamsJson(), user);
  }

  if (userTeams.length === 1) {
    return {
      redirect: {
        destination: `/teams/${userTeams[0].id}/dashboard`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      teams: userTeams,
    },
  };
});

export default Teams;
