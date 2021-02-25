import { Heading, HeadingLevels } from 'lbh-frontend-react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { EvidenceRequest } from 'src/domain/evidence-request';
import { EvidenceApiGateway } from 'src/gateways/evidence-api';
import { withAuth, WithUser } from 'src/helpers/authed-server-side-props';
import Layout from '../../../../components/DashboardLayout';
import ResidentSearchForm from '../../../../components/ResidentSearchForm';
import { ResidentTable } from '../../../../components/ResidentTable';
import { useCallback, useState } from 'react';
import { InternalApiGateway } from '../../../../gateways/internal-api';
import { Resident } from '../../../../domain/resident';
import { ResidentSummaryTable } from '../../../../components/ResidentSummaryTable';
import TableSkeleton from '../../../../components/TableSkeleton';
import Tabs from '../../../../components/Tabs';

type BrowseResidentsProps = {
  evidenceRequests: EvidenceRequest[];
};

const BrowseResidents: NextPage<WithUser<BrowseResidentsProps>> = ({
  evidenceRequests,
}) => {
  const router = useRouter();
  const { teamId } = router.query as {
    teamId: string;
  };

  // see here https://www.carlrippon.com/typed-usestate-with-typescript/ to explain useState<Resident[]>()
  const [results, setResults] = useState<Resident[]>();
  const [formSearchQuery, setFormSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async (searchQuery: string) => {
    try {
      setFormSearchQuery(searchQuery);
      setLoading(true);
      const gateway = new InternalApiGateway();
      const data = await gateway.searchResidents(searchQuery);
      setLoading(false);
      setResults(data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <Layout teamId={teamId}>
      <Head>
        <title>Browse residents</title>
      </Head>
      <h1 className="lbh-heading-h2">Browse residents</h1>

      <ResidentSearchForm handleSearch={handleSearch} />

      {(loading || results) && (
        <h2 className="lbh-heading-h3">
          Search results for: {formSearchQuery}
        </h2>
      )}

      {loading && <TableSkeleton columns={['Name', 'Email', 'Phone Number']} />}

      {results && <ResidentSummaryTable residents={results} />}

      <h2 className="lbh-heading-h3">Pending Requests</h2>

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
