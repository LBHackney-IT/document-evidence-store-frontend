import { Heading, HeadingLevels, Tile } from 'lbh-frontend-react';
import Layout from '../components/ResidentLayout';
import { ReactNode } from 'react';

const Home = (): ReactNode => (
  <Layout>
    <Heading level={HeadingLevels.H1}>Please log in</Heading>
    <Tile
      link="https://auth.hackney.gov.uk/auth?redirect_uri=http://localhost:3000"
      title="Log in with Google"
    />
    {/* <Link href={`https://auth.hackney.gov.uk/auth?redirect_uri=${redirect_uri}`} Login with google></Link> */}
  </Layout>
);

export default Home;
