import React, { FunctionComponent } from 'react';
import { Container, Header, Main, PhaseBanner } from 'lbh-frontend-react';

export const ResidentLayout: FunctionComponent = (props) => (
  <>
    <Header isStackedOnMobile={true} homepageUrl="/" />

    <Container>
      <PhaseBanner phase="ALPHA" url="form-url" />
    </Container>

    <Main>
      <div className="lbh-container">{props.children}</div>
    </Main>
  </>
);
