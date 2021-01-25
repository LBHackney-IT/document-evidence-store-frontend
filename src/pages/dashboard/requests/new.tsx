import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Head from 'next/head';
import { Paragraph } from 'lbh-frontend-react';
import NewRequestForm from '../../../components/NewRequestForm';
import {
  EvidenceRequestRequest,
  InternalApiGateway,
} from '../../../gateways/internal-api';
import { DocumentType } from '../../../domain/document-type';
import Layout from 'src/components/DashboardLayout';
import { UserContext } from 'src/contexts/UserContext';

const RequestsNewPage = (): ReactNode => {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>();
  const [complete, setComplete] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const gateway = new InternalApiGateway();
    gateway.getDocumentTypes().then(setDocumentTypes);
  }, []);

  const handleSubmit = useCallback(async (values: EvidenceRequestRequest) => {
    const gateway = new InternalApiGateway();
    const payload: EvidenceRequestRequest = {
      ...values,
      serviceRequestedBy: 'Housing benefit',
      userRequestedBy: user?.email,
    };
    await gateway.createEvidenceRequest(payload);
    setComplete(true);
  }, []);

  const form = useMemo(() => {
    if (!documentTypes) return <Paragraph>Loading</Paragraph>;
    return (
      <NewRequestForm documentTypes={documentTypes} onSubmit={handleSubmit} />
    );
  }, [documentTypes]);

  return (
    <Layout>
      <Head>
        <title>Make a new request</title>
      </Head>
      <h1 className="lbh-heading-h2">Make a new request</h1>
      {complete ? <Paragraph>Thanks!</Paragraph> : form}
    </Layout>
  );
};

export default RequestsNewPage;
