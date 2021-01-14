import React, { FunctionComponent } from 'react';
import { Header, Main } from 'lbh-frontend-react';
import PhaseBanner from '../components/PhaseBanner';
import styles from 'src/styles/SkipLink.module.scss';

const ResidentLayout: FunctionComponent = (props) => (
  <>
    <a href="#main-content" className={`lbh-body-s ${styles.skipLink}`}>
      Skip to main content
    </a>
    <Header isStackedOnMobile={true} homepageUrl="/" />
    <PhaseBanner />

    <Main id="main-content">
      <div className="lbh-container">{props.children}</div>
    </Main>
  </>
);

export default ResidentLayout;
