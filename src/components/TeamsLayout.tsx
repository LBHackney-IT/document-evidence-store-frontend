import React, { FunctionComponent, useContext } from 'react';
import { Container, Header } from 'lbh-frontend-react';
import styles from '../styles/DashboardLayout.module.scss';
import skipLinkStyles from 'src/styles/SkipLink.module.scss';
import { UserContext } from '../contexts/UserContext';
import Link from 'next/link';
import { Team } from '../domain/team';

const TeamsLayout: FunctionComponent<Props> = (props) => {
  const { user } = useContext(UserContext);
  if (!user) return <></>;

  return (
    <>
      <a
        href="#main-content"
        className={`lbh-body-s ${skipLinkStyles.skipLink}`}
      >
        Skip to main content
      </a>

      <Header
        serviceName="Upload"
        isServiceNameShort={true}
        isStackedOnMobile={true}
        homepageUrl="/teams"
      >
        <p>{user.name}</p>
        <a href="#">Sign out</a>
      </Header>

      {props.currentTeam && (
        <Container>
          <nav className={styles.switcher} aria-label="Switch service">
            <strong className={`lbh-heading-h5 ${styles['switcher__name']}`}>
              <Link href={`/teams/${props.currentTeam.id}/dashboard`}>
                <a className="lbh-link">Back to {props.currentTeam?.name}</a>
              </Link>
            </strong>
          </nav>
        </Container>
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

interface Props {
  currentTeam?: Team;
}

export default TeamsLayout;
