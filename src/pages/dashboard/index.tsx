import { Heading, HeadingLevels } from 'lbh-frontend-react';
import { NextPage } from 'next';
import Head from 'next/head';
import { EvidenceRequest } from 'src/domain/evidence-request';
import { EvidenceApiGateway } from 'src/gateways/evidence-api';
import { withAuth, WithUser } from 'src/helpers/authed-server-side-props';
import Layout from '../../components/DashboardLayout';
import ResidentSearchForm from '../../components/ResidentSearchForm';
import { ResidentTable } from '../../components/ResidentTable';
import Tabs from '../../components/Tabs';

type BrowseResidentsProps = {
  evidenceRequests: EvidenceRequest[];
};

const BrowseResidents: NextPage<WithUser<BrowseResidentsProps>> = ({
  evidenceRequests,
}) => {
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
            <ResidentTable residents={evidenceRequests} />
          </div>,
          <div key="2">
            <Heading level={HeadingLevels.H3}>All residents</Heading>
            <ResidentTable residents={evidenceRequests} />
          </div>,
        ]}
      />
    </Layout>
  );
};

export const getServerSideProps = withAuth<BrowseResidentsProps>(async () => {
  const gateway = new EvidenceApiGateway();
  const evidenceRequests = await gateway.getEvidenceRequests();

  return {
    props: { evidenceRequests },
  };
});

export default BrowseResidents;
