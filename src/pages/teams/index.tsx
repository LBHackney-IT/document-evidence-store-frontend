import TeamsJson from '../../../teams.json';
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

const teamsJson: Team[] = JSON.parse(JSON.stringify(TeamsJson));

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
  const requestAuthorizer = new RequestAuthorizer();
  const serviceAreaHelper = new TeamHelper();

  const user = requestAuthorizer.authoriseUser(ctx.req?.headers.cookie);
  let userTeams: Team[];

  if (user == undefined) {
    userTeams = [];
  } else {
    userTeams = serviceAreaHelper.filterTeamsForUser(teamsJson, user);
  }

  return {
    props: {
      teams: userTeams,
    },
  };
});

export default Teams;
