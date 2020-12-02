import { ReactNode } from 'react';
import Head from 'next/head';
import { Heading, HeadingLevels } from 'lbh-frontend-react';
import Layout from '../../components/DashboardLayout';
import evidenceTypes from './_evidence-types.json';
import NewRequestForm from '../../components/NewRequestForm';

const SendARequest = (): ReactNode => (
  <Layout>
    <Head>
      <title>Make a new request</title>
    </Head>
    <Heading level={HeadingLevels.H2}>Make a new request</Heading>
    <NewRequestForm evidenceTypes={evidenceTypes} />
  </Layout>
);

export default SendARequest;
