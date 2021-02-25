import { User } from '../domain/user';
import { TeamHelper } from './team-helper';
import { Team } from '../domain/team';

const jwtPayload = {
  groups: ['team', 'another-team'],
  name: 'frodo',
  email: 'frodo@bag.end',
} as User;

describe('Team Helper', () => {
  let instance: TeamHelper;

  beforeEach(() => {
    instance = new TeamHelper();
  });

  it('when the user is a member of all team groups', () => {
    const teamJson: Team[] = [
      {
        name: 'Team 1',
        googleGroup: 'team',
        id: '1',
        reasons: [],
      },
      {
        name: 'Team 2',
        googleGroup: 'another-team',
        id: '2',
        reasons: [],
      },
    ];

    const result = instance.filterTeamsForUser(teamJson, jwtPayload);
    expect(result).toHaveLength(2);
  });

  it('when the user is a member of one team groups', () => {
    const teamJson: Team[] = [
      {
        name: 'Team 1',
        googleGroup: 'team',
        id: '1',
        reasons: [],
      },
      {
        name: 'Team 2',
        googleGroup: 'different-team',
        id: '2',
        reasons: [],
      },
    ];

    const result = instance.filterTeamsForUser(teamJson, jwtPayload);
    expect(result).toHaveLength(1);
    expect(result[0].googleGroup).toBe('team');
  });

  it('when the user is a member of no team groups', () => {
    const teamJson: Team[] = [
      {
        name: 'Team 1',
        googleGroup: 'different-team-one',
        id: '1',
        reasons: [],
      },
      {
        name: 'Team 2',
        googleGroup: 'different-team-two',
        id: '2',
        reasons: [],
      },
    ];

    const result = instance.filterTeamsForUser(teamJson, jwtPayload);
    expect(result).toHaveLength(0);
  });

  it('when the team can be found from the ID', () => {
    const teamJson: Team[] = [
      {
        name: 'Team 1',
        googleGroup: 'team-one',
        id: '1',
        reasons: [],
      },
    ];

    const result = instance.getTeamFromId(teamJson, '1');
    expect(result?.name).toBe('Team 1');
  });

  it('when the team cannot be found from the ID', () => {
    const teamJson: Team[] = [
      {
        name: 'Team 1',
        googleGroup: 'team-one',
        id: '123',
        reasons: [],
      },
    ];

    const result = instance.getTeamFromId(teamJson, '1');
    expect(result).toBeUndefined();
  });
});
