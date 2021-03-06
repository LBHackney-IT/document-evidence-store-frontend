import React, { FunctionComponent } from 'react';
import PhaseBanner from '../components/PhaseBanner';
import Header from './Header';
import styles from 'src/styles/SkipLink.module.scss';

const ResidentLayout: FunctionComponent<Props> = (props) => (
  <>
    <a href="#main-content" className={`lbh-body-s ${styles.skipLink}`}>
      Skip to main content
    </a>

    <Header />

    <PhaseBanner feedbackUrl={props.feedbackUrl} />

    <main id="main-content" className="lbh-main-wrapper">
      <div className="lbh-container">{props.children}</div>
    </main>
  </>
);

export interface Props {
  feedbackUrl: string;
}

export default ResidentLayout;
