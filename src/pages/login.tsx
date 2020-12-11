import { Heading, HeadingLevels, Tile } from 'lbh-frontend-react';
import Layout from '../components/ResidentLayout';
import { ReactNode, useMemo } from 'react';
import { useRouter } from 'next/router';
import { createLoginUrl } from 'src/helpers/auth';

const Home = (): ReactNode => {
  const router = useRouter();
  const loginUrl = useMemo(() => {
    const { redirect = '/' } = router.query as { redirect?: string };
    return createLoginUrl(redirect);
  }, [router]);

  return (
    <Layout>
      <Heading level={HeadingLevels.H1}>Please log in</Heading>
      <Tile link={loginUrl} title="Log in with Google" />
    </Layout>
  );
};

export default Home;
