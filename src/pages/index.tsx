import Head from 'next/head';
import { Heading, HeadingLevels } from 'lbh-frontend-react';
import Layout from '../Components/DashboardLayout';
import { ReactNode } from 'react';

const BrowseResidents = (): ReactNode => (
  <Layout>
    <Head>
      <title>Browse residents</title>
    </Head>
    <Heading level={HeadingLevels.H2}>Browse residents</Heading>
  </Layout>
);

export default BrowseResidents;
