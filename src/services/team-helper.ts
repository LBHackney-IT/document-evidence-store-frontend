import { Team } from '../domain/team';
import { User } from '../domain/user';
import TeamsJson from '../../teams.json';

const teamsJson: Team[] = JSON.parse(JSON.stringify(TeamsJson));

export class TeamHelper {
  public static getTeamsJson(): Team[] {
    return teamsJson;
  }

  public static filterTeamsForUser(teamsJson: Team[], user: User): Team[] {
    return teamsJson.filter((team) => user.groups.includes(team.googleGroup));
  }

  public static userAuthorizedToViewTeam(
    teamsJson: Team[],
    user: User | undefined,
    teamId: string
  ): boolean {
    if (user == undefined) {
      return false;
    }

    const userAuthorizedToViewTeam = this.userMemberOfTeamGoogleGroup(
      teamsJson,
      user,
      teamId
    );

    if (!userAuthorizedToViewTeam) {
      console.log('User:', user, 'is not authorized to view team ID:', teamId);
    }
    return userAuthorizedToViewTeam;
  }

  private static userMemberOfTeamGoogleGroup(
    teamsJson: Team[],
    user: User,
    teamId: string
  ): boolean {
    const userTeams = this.filterTeamsForUser(teamsJson, user);
    const filterUserTeamsByTeamId = userTeams.filter(
      (team) => team.id == teamId
    );
    return filterUserTeamsByTeamId.length > 0;
  }

  public static getTeamFromId(
    teamsJson: Team[],
    teamId: string
  ): Team | undefined {
    return teamsJson.find((team) => team.id == teamId);
  }

  public static getTeamByName(
    teamsJson: Team[],
    teamName: string
  ): Team | undefined {
    return teamsJson.find((team) => team.name == teamName);
  }
}
