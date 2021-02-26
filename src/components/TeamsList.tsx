import React from 'react';
import Link from 'next/link';
import { Team } from '../domain/team';

const TeamsList = (props: Props): JSX.Element => {
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <ul className="lbh-list lbh-body-l">
          {props.teams.map((team) => (
            <li key={team.id}>
              <Link href={`/teams/${team.id}/dashboard`}>
                <a className="lbh-link">{team.name}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

interface Props {
  teams: Array<Team>;
}

export default TeamsList;
