import React, { FunctionComponent, useContext } from 'react';
import { Container, Header } from 'lbh-frontend-react';
import NavLink from './NavLink';
import styles from '../styles/DashboardLayout.module.scss';
import skipLinkStyles from 'src/styles/SkipLink.module.scss';
import { UserContext } from '../contexts/UserContext';
import ResidentLayout from './ResidentLayout';

const Layout: FunctionComponent = ({ children }) => {
  const { user } = useContext(UserContext);

  if (!user) return <ResidentLayout>{children}</ResidentLayout>;

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
        homepageUrl="/"
      >
        <p>{user.name}</p>
        <a href="#">Sign out</a>
      </Header>

      <Container>
        <nav className={styles.switcher} aria-label="Switch service">
          <strong className={`lbh-heading-h5 ${styles['switcher__name']}`}>
            Housing benefit
          </strong>
          <a href="#" className={`lbh-link ${styles['switcher__link']} `}>
            Switch service
          </a>
        </nav>
      </Container>

      <div className="lbh-main-wrapper">
        <div className={`lbh-container ${styles.layout}`}>
          <nav className={styles['layout__sidebar']}>
            <ul className="lbh-list">
              <li>
                <NavLink href="/dashboard">Residents</NavLink>
              </li>
              <li>
                <NavLink href="/dashboard/requests">Requests</NavLink>
              </li>
            </ul>
          </nav>

          <main
            className={styles['layout__pane']}
            id="main-content"
            role="main"
          >
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
