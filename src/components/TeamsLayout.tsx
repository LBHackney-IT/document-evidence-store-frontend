import React, { FunctionComponent, useContext } from 'react';
import Header from './Header';
import styles from '../styles/DashboardLayout.module.scss';
import skipLinkStyles from 'src/styles/SkipLink.module.scss';
import { UserContext } from '../contexts/UserContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { TeamHelper } from '../services/team-helper';

const TeamsLayout: FunctionComponent = (props) => {
  const { user } = useContext(UserContext);
  if (!user) return <></>;

  const router = useRouter();
  const { teamId } = router.query as {
    teamId: string;
  };
  let currentTeam;
  if (teamId !== undefined) {
    currentTeam = TeamHelper.getTeamFromId(TeamHelper.getTeamsJson(), teamId);
  }

  return (
    <>
      <a
        href="#main-content"
        className={`lbh-body-s ${skipLinkStyles.skipLink}`}
      >
        Skip to main content
      </a>

      <Header userName={user.name} />

      {teamId && (
        <div className="lbh-container">
          <nav className={styles.switcher} aria-label="Switch service">
            <strong className={`lbh-heading-h5 ${styles['switcher__name']}`}>
              <Link href={`/teams/${teamId}/dashboard`}>
                <a className="lbh-link">Back to {currentTeam?.name}</a>
              </Link>
            </strong>
          </nav>
        </div>
      )}

      <div className="lbh-main-wrapper">
        <div className={`lbh-container ${styles.layout}`}>
          <main className={styles['layout__pane']} id="main-content">
            {props.children}
          </main>
        </div>
      </div>
    </>
  );
};

export default TeamsLayout;
