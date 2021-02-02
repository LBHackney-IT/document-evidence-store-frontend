import Head from 'next/head';
import Link from 'next/link';
import { EvidenceRequestTable } from '../../../components/EvidenceRequestTable';
import Layout from 'src/components/DashboardLayout';
import { EvidenceRequestResponse } from 'types/api';
import { GetServerSideProps, NextPage } from 'next';
import { ResponseMapper } from 'src/boundary/response-mapper';
import { EvidenceApiGateway } from 'src/gateways/evidence-api';

type RequestsIndexPageProps = {
  evidenceRequestsResponse: EvidenceRequestResponse[];
};

const RequestsIndexPage: NextPage<RequestsIndexPageProps> = ({
  evidenceRequestsResponse,
}) => {
  const evidenceRequests = evidenceRequestsResponse.map(
    ResponseMapper.mapEvidenceRequest
  );

  return (
    <Layout>
      <Head>
        <title>Pending requests</title>
      </Head>
      <h1 className="lbh-heading-h2">Pending requests</h1>
      <EvidenceRequestTable requests={evidenceRequests} />
      <Link href="/dashboard/requests/new">
        <a className="govuk-button lbh-button">New request</a>
      </Link>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<RequestsIndexPageProps> = async () => {
  const gateway = new EvidenceApiGateway();
  const evidenceRequestsResponse = await gateway.getEvidenceRequests();
  return {
    props: { evidenceRequestsResponse },
  };
};

export default RequestsIndexPage;
