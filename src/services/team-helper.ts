import { Team } from '../domain/team';
import { User } from '../domain/user';
import TeamsJson from '../../teams.json';

const teamsJson: Team[] = JSON.parse(JSON.stringify(TeamsJson));

export class TeamHelper {
  public getTeamsJson(): Team[] {
    return teamsJson;
  }

  public filterTeamsForUser(teamsJson: Team[], user: User): Team[] {
    return teamsJson.filter((team) => user.groups.includes(team.googleGroup));
  }

  public getTeamFromId(teamsJson: Team[], teamId: string): Team | undefined {
    return teamsJson.find((team) => team.id == teamId);
  }
}
