import React, { FunctionComponent, useContext } from 'react';
import NavLink from './NavLink';
import styles from '../styles/DashboardLayout.module.scss';
import skipLinkStyles from 'src/styles/SkipLink.module.scss';
import { UserContext } from '../contexts/UserContext';
import Header from './Header';
import { TeamHelper } from '../services/team-helper';
import Link from 'next/link';
import ResidentLayout from './ResidentLayout';

const Layout: FunctionComponent<Props> = (props, { children }) => {
  const { user } = useContext(UserContext);

  if (!user)
    return (
      <ResidentLayout
        feedbackUrl={process.env.FEEDBACK_FORM_RESIDENT_URL as string}
      >
        {children}
      </ResidentLayout>
    );

  const currentTeam = TeamHelper.getTeamFromId(
    TeamHelper.getTeamsJson(),
    props.teamId
  );

  const userTeams = TeamHelper.filterTeamsForUser(
    TeamHelper.getTeamsJson(),
    user
  );

  return (
    <>
      <a
        href="#main-content"
        className={`lbh-body-s ${skipLinkStyles.skipLink}`}
      >
        Skip to main content
      </a>

      <Header userName={user.name} />

      <div className="lbh-container">
        <nav className={styles.switcher} aria-label="Switch teams">
          <strong className={`lbh-heading-h5 ${styles['switcher__name']}`}>
            {currentTeam?.name}
          </strong>
          {userTeams.length > 1 && (
            <Link
              href={{
                pathname: '/teams',
                query: { teamId: props.teamId },
              }}
            >
              <a className={`lbh-link ${styles['switcher__link']}`}>
                Switch team
              </a>
            </Link>
          )}
        </nav>
      </div>

      <div className="lbh-main-wrapper">
        <div className={`lbh-container ${styles.layout}`}>
          <nav className={styles['layout__sidebar']}>
            <ul className="lbh-list">
              <li>
                <NavLink href={`/teams/${props.teamId}/dashboard`}>
                  Residents
                </NavLink>
              </li>
              <li>
                <NavLink href={`/teams/${props.teamId}/dashboard/requests`}>
                  Requests
                </NavLink>
              </li>
            </ul>
          </nav>

          <main className={styles['layout__pane']} id="main-content">
            {props.children}
          </main>
        </div>
      </div>
    </>
  );
};

interface Props {
  teamId: string;
}

export default Layout;
