import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { Heading, HeadingLevels, Paragraph } from 'lbh-frontend-react';
import Layout from '../../components/DashboardLayout';
import NewRequestForm from '../../components/NewRequestForm';
import {
  EvidenceRequestRequest,
  InternalApiGateway,
} from '../../gateways/internal-api';
import { DocumentType } from '../../domain/document-type';

const RequestsNewPage = (): ReactNode => {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>();
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const gateway = new InternalApiGateway();
    gateway.getDocumentTypes().then(setDocumentTypes);
  }, []);

  const handleSubmit = useCallback(async (values: EvidenceRequestRequest) => {
    const gateway = new InternalApiGateway();
    const payload = { ...values, serviceRequestedBy: 'Housing benefit' };
    await gateway.createEvidenceRequest(payload);
    setComplete(true);
  }, []);

  const form = useMemo(() => {
    if (!documentTypes) return <p>Loading</p>;
    return (
      <NewRequestForm documentTypes={documentTypes} onSubmit={handleSubmit} />
    );
  }, [documentTypes]);

  return (
    <Layout>
      <Head>
        <title>Make a new request</title>
      </Head>
      <Heading level={HeadingLevels.H2}>Make a new request</Heading>
      {complete ? <Paragraph>Thanks!</Paragraph> : form}
    </Layout>
  );
};

export default RequestsNewPage;
