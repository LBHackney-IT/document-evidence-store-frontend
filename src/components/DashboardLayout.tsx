import React from 'react';
import { Container, Header, Main, PhaseBanner } from 'lbh-frontend-react';
import NavLink from './NavLink';

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
      <header className="lbu-service-switcher">
        <strong className="lbu-service-switcher__name lbh-heading-h5">
          Housing benefit
        </strong>
        <a href="#" className="lbu-service-switcher__link lbh-link">
          Switch service
        </a>
      </header>
    </Container>

    <div className="lbh-main-wrapper">
      <div className="lbh-container lbu-layout">
        <nav className="lbu-layout__sidebar">
          <ul className="lbh-list">
            <li>
              <NavLink href="/">Residents</NavLink>
            </li>
            <li>
              <NavLink href="/requests">Requests</NavLink>
            </li>
          </ul>
        </nav>

        <main className="lbu-layout__pane" id="main-content" role="main">
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
