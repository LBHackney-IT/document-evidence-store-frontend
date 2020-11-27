import {
  Container,
  Header,
  Heading,
  HeadingLevels,
  Main,
  PhaseBanner,
  Tile,
} from 'lbh-frontend-react';
import { ReactNode } from 'react';

const Home = (): ReactNode => {
  return (
    <div>
      <Header serviceName="Document Evidence Service">
        <title>Document Evidence Service</title>
        <link rel="icon" href="/favicon.ico" />
      </Header>
      <Container>
        <PhaseBanner phase="ALPHA" url="form-url" />
      </Container>
      <Main>
        <div className="lbh-container">
          <Heading level={HeadingLevels.H1}>Please log in</Heading>
          <Tile
            link="https://auth.hackney.gov.uk/auth?redirect_uri=http://localdev.hackney.gov.uk:3000/temp"
            title="Log in with Google"
          />
          {/* <Link href={`https://auth.hackney.gov.uk/auth?redirect_uri=${redirect_uri}`} Login with google></Link> */}
        </div>
      </Main>
    </div>
  );
};

export default Home;
