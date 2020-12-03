import React from 'react';
import { Container, Header, Main, PhaseBanner } from 'lbh-frontend-react';

const Layout = (props: Props): JSX.Element => (
  <>
    <Header isStackedOnMobile={true} homepageUrl="/" />

    <Container>
      <PhaseBanner phase="ALPHA" url={process.env.FEEDBACK_FORM_URL} />
    </Container>

    <Main>
      <div className="lbh-container">{props.children}</div>
    </Main>
  </>
);

export interface Props {
  children: React.ReactNode;
}

export default Layout;
