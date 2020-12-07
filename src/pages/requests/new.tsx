import { ReactNode, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { Heading, HeadingLevels } from 'lbh-frontend-react';
import Layout from '../../components/DashboardLayout';
import NewRequestForm from '../../components/NewRequestForm';
import { InternalApiGateway } from '../../gateways/internal-api';
import { DocumentType } from '../../domain/document-type';

const RequestsNewPage = (): ReactNode => {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>();

  useEffect(() => {
    const gateway = new InternalApiGateway();
    gateway.getDocumentTypes().then(setDocumentTypes);
  }, []);

  const form = useMemo(() => {
    if (!documentTypes) return <p>Loading</p>;
    return <NewRequestForm documentTypes={documentTypes} />;
  }, [documentTypes]);

  return (
    <Layout>
      <Head>
        <title>Make a new request</title>
      </Head>
      <Heading level={HeadingLevels.H2}>Make a new request</Heading>
      {form}
    </Layout>
  );
};

export default RequestsNewPage;
