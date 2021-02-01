import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { Heading, HeadingLevels } from 'lbh-frontend-react';
import { ReactNode } from 'react';
import { EvidenceRequest } from '../../domain/evidence-request';
import { InternalApiGateway } from '../../gateways/internal-api';
import { ResidentTable } from '../../components/ResidentTable';
import ResidentSearchForm from '../../components/ResidentSearchForm';
import Tabs from '../../components/Tabs';
import TableSkeleton from '../../components/TableSkeleton';
import Layout from '../../components/DashboardLayout';

const BrowseResidents = (): ReactNode => {
  const [evidenceRequests, setEvidenceRequests] = useState<EvidenceRequest[]>();

  useEffect(() => {
    const gateway = new InternalApiGateway();
    gateway.getEvidenceRequests().then(setEvidenceRequests);
  }, []);

  const table = useMemo(() => {
    if (!evidenceRequests)
      return <TableSkeleton columns={['Resident', 'Document', 'Made']} />;

    return <ResidentTable residents={evidenceRequests} />;
  }, [evidenceRequests]);

  const handleSearch = () => {
    // handle search here
  };

  return (
    <Layout>
      <Head>
        <title>Browse residents</title>
      </Head>
      <h1 className="lbh-heading-h2">Browse residents</h1>

      <ResidentSearchForm handleSearch={handleSearch} />

      <Tabs
        tabTitles={['To review (3)', 'All (3)']}
        children={[
          <div key="1">
            <Heading level={HeadingLevels.H3}>To review</Heading>
            {table}
          </div>,
          <div key="2">
            <Heading level={HeadingLevels.H3}>All residents</Heading>
            {table}
          </div>,
        ]}
      />
    </Layout>
  );
};

export default BrowseResidents;
