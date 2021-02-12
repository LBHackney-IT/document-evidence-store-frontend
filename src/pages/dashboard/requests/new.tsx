import { Paragraph } from 'lbh-frontend-react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useCallback, useState } from 'react';
import Layout from 'src/components/DashboardLayout';
import { EvidenceApiGateway } from 'src/gateways/evidence-api';
import { withAuth, WithUser } from 'src/helpers/authed-server-side-props';
import NewRequestForm from '../../../components/NewRequestForm';
import { DocumentType } from '../../../domain/document-type';
import {
  EvidenceRequestRequest,
  InternalApiGateway,
} from '../../../gateways/internal-api';

type RequestsNewPageProps = {
  documentTypes: DocumentType[];
};

const RequestsNewPage: NextPage<WithUser<RequestsNewPageProps>> = ({
  documentTypes,
  user,
}) => {
  const [complete, setComplete] = useState(false);

  const handleSubmit = useCallback(async (values: EvidenceRequestRequest) => {
    const gateway = new InternalApiGateway();
    const payload: EvidenceRequestRequest = {
      ...values,
      // TODO: pass this in from the users chosen service after DES-25
      serviceRequestedBy: 'Housing benefit',
      userRequestedBy: user?.email,
    };
    await gateway.createEvidenceRequest(payload);
    setComplete(true);
  }, []);

  return (
    <Layout>
      <Head>
        <title>Make a new request</title>
      </Head>
      <h1 className="lbh-heading-h2">Make a new request</h1>
      {complete ? (
        <Paragraph>Thanks!</Paragraph>
      ) : (
        <NewRequestForm documentTypes={documentTypes} onSubmit={handleSubmit} />
      )}
    </Layout>
  );
};

export const getServerSideProps = withAuth<RequestsNewPageProps>(async () => {
  const gateway = new EvidenceApiGateway();
  const documentTypes = await gateway.getDocumentTypes();
  return { props: { documentTypes } };
});

export default RequestsNewPage;
