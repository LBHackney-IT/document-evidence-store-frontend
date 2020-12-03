import { Heading, HeadingLevels, Tile } from 'lbh-frontend-react';
import Layout from '../../../components/ResidentLayout';
import InterruptionCard from '../../../components/InterruptionCard';
import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';

const Index = (): ReactNode => {
  const router = useRouter();
  const { requestId } = router.query;

  return (
    <Layout>
      <Head>
        <title>Upload your documents</title>
      </Head>
      <Heading level={HeadingLevels.H1}>Upload your documents</Heading>
      <p className="lbh-body">
        Upload a photograph or scan for the following evidence.
      </p>

      <Link href={`/resident/${requestId}/confirmation`}>
        <a className="govuk-button lbh-button">Continue</a>
      </Link>
    </Layout>
  );
};

export default Index;
