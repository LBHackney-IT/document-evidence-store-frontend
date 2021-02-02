import { useCallback, useContext, useState } from 'react';
import Head from 'next/head';
import { Paragraph } from 'lbh-frontend-react';
import NewRequestForm from '../../../components/NewRequestForm';
import {
  EvidenceRequestRequest,
  InternalApiGateway,
} from '../../../gateways/internal-api';
import { IDocumentType } from '../../../domain/document-type';
import Layout from 'src/components/DashboardLayout';
import { UserContext } from 'src/contexts/UserContext';
import { GetServerSideProps, NextPage } from 'next';
import { ResponseMapper } from 'src/boundary/response-mapper';
import { EvidenceApiGateway } from 'src/gateways/evidence-api';

type RequestsNewPageProps = {
  documentTypesResponse: IDocumentType[];
};

const RequestsNewPage: NextPage<RequestsNewPageProps> = ({
  documentTypesResponse,
}) => {
  const documentTypes = documentTypesResponse.map(
    ResponseMapper.mapDocumentType
  );
  const [complete, setComplete] = useState(false);
  const { user } = useContext(UserContext);

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

export const getServerSideProps: GetServerSideProps<RequestsNewPageProps> = async () => {
  const gateway = new EvidenceApiGateway();
  const documentTypesResponse = await gateway.getDocumentTypes();
  return { props: { documentTypesResponse } };
};

export default RequestsNewPage;
