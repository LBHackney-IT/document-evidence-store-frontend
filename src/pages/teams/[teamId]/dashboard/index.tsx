import { Heading, HeadingLevels } from 'lbh-frontend-react';
import { NextPage } from 'next';
import Head from 'next/head';
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
import { RequestAuthorizer } from '../../../../services/request-authorizer';
import { TeamHelper } from '../../../../services/team-helper';

type BrowseResidentsProps = {
  evidenceRequests: EvidenceRequest[];
  teamId: string;
};

const BrowseResidents: NextPage<WithUser<BrowseResidentsProps>> = ({
  evidenceRequests,
  teamId,
}) => {
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

      {results && <ResidentSummaryTable residents={results} teamId={teamId} />}

      <h2 className="lbh-heading-h3">Pending Requests</h2>

      <Tabs
        tabTitles={['To review (3)', 'All (3)']}
        children={[
          <div key="1">
            <Heading level={HeadingLevels.H3}>To review</Heading>
            <ResidentTable residents={evidenceRequests} teamId={teamId} />
          </div>,
          <div key="2">
            <Heading level={HeadingLevels.H3}>All residents</Heading>
            <ResidentTable residents={evidenceRequests} teamId={teamId} />
          </div>,
        ]}
      />
    </Layout>
  );
};

export const getServerSideProps = withAuth<BrowseResidentsProps>(
  async (ctx) => {
    const { teamId } = ctx.query as {
      teamId: string;
    };

    const user = new RequestAuthorizer().authoriseUser(ctx.req?.headers.cookie);
    const userAuthorizedToViewTeam = TeamHelper.userAuthorizedToViewTeam(
      TeamHelper.getTeamsJson(),
      user,
      teamId
    );

    if (!userAuthorizedToViewTeam) {
      return {
        redirect: {
          destination: '/teams',
          permanent: false,
        },
      };
    }

    const gateway = new EvidenceApiGateway();
    const evidenceRequests = await gateway.getEvidenceRequests();
    return {
      props: { evidenceRequests, teamId },
    };
  }
);

export default BrowseResidents;
