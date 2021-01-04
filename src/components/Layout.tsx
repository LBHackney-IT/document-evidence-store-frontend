import React, { FunctionComponent, useContext } from 'react';
import { Container, Header } from 'lbh-frontend-react';
import NavLink from './NavLink';
import styles from '../styles/DashboardLayout.module.scss';
import { UserContext } from './UserContext/UserContext';
import { ResidentLayout } from './ResidentLayout';

export const Layout: FunctionComponent = ({ children }) => {
  const { user } = useContext(UserContext);

  if (!user) return <ResidentLayout>{children}</ResidentLayout>;

  return (
    <>
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
        <header className={styles.switcher}>
          <strong className={`lbh-heading-h5 ${styles['switcher__name']}`}>
            Housing benefit
          </strong>
          <a href="#" className={`lbh-link ${styles['switcher__link']} `}>
            Switch service
          </a>
        </header>
      </Container>

      <div className="lbh-main-wrapper">
        <div className={`lbh-container ${styles.layout}`}>
          <nav className={styles['layout__sidebar']}>
            <ul className="lbh-list">
              <li>
                <NavLink href="/">Residents</NavLink>
              </li>
              <li>
                <NavLink href="/requests">Requests</NavLink>
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