import React, { ReactNode, useContext } from 'react';
import { Container, Header } from 'lbh-frontend-react';
import NavLink from './NavLink';
import styles from '../styles/DashboardLayout.module.scss';
import { UserContext } from '../contexts/UserContext';
import ResidentLayout from './ResidentLayout';
import Link from 'next/link';

const Layout = (props: Props): JSX.Element => {
  const { user } = useContext(UserContext);

  if (!user) return <ResidentLayout>{props.children}</ResidentLayout>;

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
        {props.noService ? (
          <header className={styles.switcher}>
            <strong className={`lbh-heading-h5 ${styles['switcher__name']}`}>
              <Link href="/dashboard">
                <a className={`lbh-link ${styles['switcher__link']} `}>
                  Back to Housing benefit
                </a>
              </Link>
            </strong>
          </header>
        ) : (
          <header className={styles.switcher}>
            <strong className={`lbh-heading-h5 ${styles['switcher__name']}`}>
              Housing benefit
            </strong>
            <Link href="/dashboard/switch-service">
              <a className={`lbh-link ${styles['switcher__link']} `}>
                Switch service
              </a>
            </Link>
          </header>
        )}
      </Container>

      <div className="lbh-main-wrapper">
        {props.noService ? (
          <Container>{props.children}</Container>
        ) : (
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
              {props.children}
            </main>
          </div>
        )}
      </div>
    </>
  );
};

export default Layout;

interface Props {
  children: ReactNode;
  noService?: boolean;
}
