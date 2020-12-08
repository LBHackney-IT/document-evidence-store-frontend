import { Heading, HeadingLevels } from 'lbh-frontend-react';
import Layout from '../../../components/ResidentLayout';
import { ReactNode } from 'react';
import Head from 'next/head';
import UploaderForm from '../../../components/UploaderForm';

const Index = (): ReactNode => (
  <Layout>
    <Head>
      <title>Upload your documents</title>
    </Head>
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <Heading level={HeadingLevels.H1}>Upload your documents</Heading>
        <p className="lbh-body">
          Upload a photograph or scan for the following evidence.
        </p>
        <UploaderForm />
      </div>
    </div>
  </Layout>
);

export default Index;
