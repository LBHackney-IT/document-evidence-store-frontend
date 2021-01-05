import React, { FunctionComponent } from 'react';
import { Header, Main } from 'lbh-frontend-react';
import PhaseBanner from '../components/PhaseBanner';

const ResidentLayout: FunctionComponent = (props) => (
  <>
    <Header isStackedOnMobile={true} homepageUrl="/" />
    <PhaseBanner />

    <Main>
      <div className="lbh-container">{props.children}</div>
    </Main>
  </>
);

export default ResidentLayout;
