import Head from 'next/head';
import { Heading, HeadingLevels } from 'lbh-frontend-react';
import Link from 'next/link';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { EvidenceRequest } from '../../domain/evidence-request';
import { InternalApiGateway } from '../../gateways/internal-api';
import { EvidenceRequestTable } from '../../components/EvidenceRequestTable';
import TableSkeleton from '../../components/TableSkeleton';

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
    <>
      <Head>
        <title>Pending requests</title>
      </Head>
      <Heading level={HeadingLevels.H2}>Pending requests</Heading>
      {table}
      <Link href="/requests/new">
        <a className="govuk-button lbh-button">New request</a>
      </Link>
    </>
  );
};

export default RequestsIndexPage;
