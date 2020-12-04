import React, { FunctionComponent } from 'react';
import { Container, Header, Main, PhaseBanner } from 'lbh-frontend-react';

const Layout: FunctionComponent = (props) => (
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

export default Layout;
