import { User } from '../domain/user';
import { TeamHelper } from './team-helper';
import { Team } from '../domain/team';

const jwtPayload = {
  groups: ['team', 'another-team'],
  name: 'frodo',
  email: 'frodo@bag.end',
} as User;

describe('Team Helper', () => {
  it('when the user is a member of all team groups', () => {
    const teamJson: Team[] = [
      {
        name: 'Team 1',
        googleGroup: 'team',
        id: '1',
        reasons: [],
        slaMessage: 'example message team 1',
      },
      {
        name: 'Team 2',
        googleGroup: 'another-team',
        id: '2',
        reasons: [],
        slaMessage: 'example message team 2',
      },
    ];

    const result = TeamHelper.filterTeamsForUser(teamJson, jwtPayload);
    expect(result).toHaveLength(2);
  });

  it('when the user is a member of one team groups', () => {
    const teamJson: Team[] = [
      {
        name: 'Team 1',
        googleGroup: 'team',
        id: '1',
        reasons: [],
        slaMessage: 'example message team 1',
      },
      {
        name: 'Team 2',
        googleGroup: 'different-team',
        id: '2',
        reasons: [],
        slaMessage: 'example message team 2',
      },
    ];

    const result = TeamHelper.filterTeamsForUser(teamJson, jwtPayload);
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
        slaMessage: 'example message team 1',
      },
      {
        name: 'Team 2',
        googleGroup: 'different-team-two',
        id: '2',
        reasons: [],
        slaMessage: 'example message team 2',
      },
    ];

    const result = TeamHelper.filterTeamsForUser(teamJson, jwtPayload);
    expect(result).toHaveLength(0);
  });

  it('when the team can be found from the ID', () => {
    const teamJson: Team[] = [
      {
        name: 'Team 1',
        googleGroup: 'team-one',
        id: '1',
        reasons: [],
        slaMessage: 'example message team 1',
      },
    ];

    const result = TeamHelper.getTeamFromId(teamJson, '1');
    expect(result?.name).toBe('Team 1');
  });

  it('when the team cannot be found from the ID', () => {
    const teamJson: Team[] = [
      {
        name: 'Team 1',
        googleGroup: 'team-one',
        id: '123',
        reasons: [],
        slaMessage: 'example message team 1',
      },
    ];

    const result = TeamHelper.getTeamFromId(teamJson, '1');
    expect(result).toBeUndefined();
  });

  it('when the user should be able to view both teams', () => {
    const teamJson: Team[] = [
      {
        name: 'Team 1',
        googleGroup: 'team',
        id: '1',
        reasons: [],
        slaMessage: 'example message team 1',
      },
      {
        name: 'Team 2',
        googleGroup: 'another-team',
        id: '2',
        reasons: [],
        slaMessage: 'example message team 2',
      },
    ];

    let result = TeamHelper.userAuthorizedToViewTeam(teamJson, jwtPayload, '1');
    expect(result).toBeTruthy();
    result = TeamHelper.userAuthorizedToViewTeam(teamJson, jwtPayload, '2');
    expect(result).toBeTruthy();
  });

  it('when the user should be able to view one team', () => {
    const teamJson: Team[] = [
      {
        name: 'Team 1',
        googleGroup: 'team',
        id: '1',
        reasons: [],
        slaMessage: 'example message team 1',
      },
      {
        name: 'Team 2',
        googleGroup: 'different-team',
        id: '2',
        reasons: [],
        slaMessage: 'example message team 2',
      },
    ];

    let result = TeamHelper.userAuthorizedToViewTeam(teamJson, jwtPayload, '1');
    expect(result).toBeTruthy();
    result = TeamHelper.userAuthorizedToViewTeam(teamJson, jwtPayload, '2');
    expect(result).toBeFalsy();
  });

  it('when the user should not be able to view any teams', () => {
    const teamJson: Team[] = [
      {
        name: 'Team 1',
        googleGroup: 'different-team',
        id: '1',
        reasons: [],
        slaMessage: 'example message team 1',
      },
    ];

    const result = TeamHelper.userAuthorizedToViewTeam(
      teamJson,
      jwtPayload,
      '1'
    );
    expect(result).toBeFalsy();
  });

  it('when the team can be found by name', () => {
    const teamJson: Team[] = [
      {
        name: 'Team 1',
        googleGroup: 'team-one',
        id: '1',
        reasons: [],
        slaMessage: 'example message team 1',
      },
    ];

    const result = TeamHelper.getTeamByName(teamJson, 'Team 1');
    expect(result?.name).toBe('Team 1');
    expect(result?.googleGroup).toBe('team-one');
    expect(result?.id).toBe('1');
    expect(result?.slaMessage).toBe('example message team 1');
  });

  it('when the team cannot be found by name', () => {
    const teamJson: Team[] = [
      {
        name: 'Team 1',
        googleGroup: 'team-one',
        id: '123',
        reasons: [],
        slaMessage: 'example message team 1',
      },
    ];

    const result = TeamHelper.getTeamByName(teamJson, 'Team 2');
    expect(result).toBeUndefined();
  });
});
