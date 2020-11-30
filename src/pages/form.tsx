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
          <Heading level={HeadingLevels.H1}>Send a request</Heading>
        </div>
      </Main>
    </div>
  );
};

export default Home;
