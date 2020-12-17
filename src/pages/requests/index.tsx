import Head from 'next/head';
import { Heading, HeadingLevels, Paragraph } from 'lbh-frontend-react';
import Link from 'next/link';
import Layout from '../../components/DashboardLayout';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { EvidenceRequest } from '../../domain/evidence-request';
import { InternalApiGateway } from '../../gateways/internal-api';
import { EvidenceRequestTable } from '../../components/EvidenceRequestTable';

const RequestsIndexPage = (): ReactNode => {
  const [evidenceRequests, setEvidenceRequests] = useState<EvidenceRequest[]>();

  useEffect(() => {
    const gateway = new InternalApiGateway();
    gateway.getEvidenceRequests().then(setEvidenceRequests);
  }, []);

  const table = useMemo(() => {
    if (!evidenceRequests) return <Paragraph>Loading</Paragraph>;

    return <EvidenceRequestTable requests={evidenceRequests} />;
  }, [evidenceRequests]);

  return (
    <Layout>
      <Head>
        <title>Pending requests</title>
      </Head>
      <Heading level={HeadingLevels.H2}>Pending requests</Heading>
      {table}
      <Link href="/requests/new">
        <a className="govuk-button lbh-button">New request</a>
      </Link>
    </Layout>
  );
};

export default RequestsIndexPage;
