import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { Heading, HeadingLevels } from 'lbh-frontend-react';
import Layout from '../components/DashboardLayout';
import { ReactNode } from 'react';
import { EvidenceRequest } from '../domain/evidence-request';
import { InternalApiGateway } from '../gateways/internal-api';
import { EvidenceRequestTable } from '../components/EvidenceRequestTable';
import ResidentSearchForm from '../components/ResidentSearchForm';
import Tabs from '../components/Tabs';

const BrowseResidents = (): ReactNode => {
  const [evidenceRequests, setEvidenceRequests] = useState<EvidenceRequest[]>();

  useEffect(() => {
    const gateway = new InternalApiGateway();
    gateway.getEvidenceRequests().then(setEvidenceRequests);
  }, []);

  const table = useMemo(() => {
    if (!evidenceRequests) return <p>Loading</p>;

    return <EvidenceRequestTable requests={evidenceRequests} />;
  }, [evidenceRequests]);

  const handleSearch = () => {
    // handle search here
  };

  return (
    <Layout>
      <Head>
        <title>Browse residents</title>
      </Head>
      <Heading level={HeadingLevels.H2}>Browse residents</Heading>

      <ResidentSearchForm handleSearch={handleSearch} />

      <Tabs
        tabTitles={['One', 'Two', 'Three']}
        children={[{ table }, { table }, { table }]}
      />
    </Layout>
  );
};

export default BrowseResidents;
