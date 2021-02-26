import { Team } from '../domain/team';
import { User } from '../domain/user';

export class TeamHelper {
  public filterTeamsForUser(teamsJson: Team[], user: User): Team[] {
    return teamsJson.filter((team) => user.groups.includes(team.googleGroup));
  }
}
