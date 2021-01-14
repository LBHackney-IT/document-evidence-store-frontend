import Head from 'next/head';
import Link from 'next/link';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { EvidenceRequest } from '../../../domain/evidence-request';
import { InternalApiGateway } from '../../../gateways/internal-api';
import { EvidenceRequestTable } from '../../../components/EvidenceRequestTable';
import TableSkeleton from '../../../components/TableSkeleton';
import Layout from 'src/components/DashboardLayout';

const RequestsIndexPage = (): ReactNode => {
  const [evidenceRequests, setEvidenceRequests] = useState<EvidenceRequest[]>();

  useEffect(() => {
    const gateway = new InternalApiGateway();
    gateway.getEvidenceRequests().then(setEvidenceRequests);
  }, []);

  const table = useMemo(() => {
    if (!evidenceRequests)
      return <TableSkeleton columns={['Resident', 'Document', 'Made']} />;

    return <EvidenceRequestTable requests={evidenceRequests} />;
  }, [evidenceRequests]);

  return (
    <Layout>
      <Head>
        <title>Pending requests</title>
      </Head>
      <h1 className="lbh-heading-h2">Pending requests</h1>
      {table}
      <Link href="/dashboard/requests/new">
        <a className="govuk-button lbh-button">New request</a>
      </Link>
    </Layout>
  );
};

export default RequestsIndexPage;
