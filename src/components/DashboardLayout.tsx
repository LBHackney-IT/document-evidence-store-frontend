import React from 'react';
import { Container, Header, Main, PhaseBanner } from 'lbh-frontend-react';
import NavLink from './NavLink';
import styles from '../styles/DashboardLayout.module.scss';

const Layout = (props: Props): JSX.Element => (
  <>
    <Header
      serviceName="Upload"
      isServiceNameShort={true}
      isStackedOnMobile={true}
      homepageUrl="/"
    >
      <p>Anne James</p>
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

        <main className={styles['layout__pane']} id="main-content" role="main">
          {props.children}
        </main>
      </div>
    </div>
  </>
);

export interface Props {
  children: React.ReactNode;
}

export default Layout;
