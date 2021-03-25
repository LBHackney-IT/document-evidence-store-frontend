import React, { FunctionComponent, useContext } from 'react';
import NavLink from './NavLink';
import styles from '../styles/DashboardLayout.module.scss';
import skipLinkStyles from 'src/styles/SkipLink.module.scss';
import { UserContext } from '../contexts/UserContext';
import ResidentLayout from './ResidentLayout';
import Header from './Header';
import { TeamHelper } from '../services/team-helper';
import Link from 'next/link';

const Layout: FunctionComponent<Props> = (props, { children }) => {
  const { user } = useContext(UserContext);

  if (!user) return <ResidentLayout>{children}</ResidentLayout>;

  const currentTeam = TeamHelper.getTeamFromId(
    TeamHelper.getTeamsJson(),
    props.teamId
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
