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
// import Tabs from '../../../../components/Tabs';
import { RequestAuthorizer } from '../../../../services/request-authorizer';
import { TeamHelper } from '../../../../services/team-helper';
import { Team } from '../../../../domain/team';
import { User } from '../../../../domain/user';
import { EvidenceRequestState } from 'src/domain/enums/EvidenceRequestState';

type BrowseResidentsProps = {
  evidenceRequests: EvidenceRequest[];
  team: Team;
  user: User;
  feedbackUrl: string;
  filteredEvidenceRequests: EvidenceRequest[];
};

const BrowseResidents: NextPage<WithUser<BrowseResidentsProps>> = ({
  evidenceRequests,
  team,
  user,
  feedbackUrl,
}) => {
  // see here https://www.carlrippon.com/typed-usestate-with-typescript/ to explain useState<Resident[]>()
  const [results, setResults] = useState<Resident[]>();
  const [formSearchQuery, setFormSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterToReview, setFilterToReview] = useState(false);
  const [resultFilterToReview, setResultFilterToReview] = useState<
    EvidenceRequest[]
  >();

  const handleSearch = useCallback(async (searchQuery: string) => {
    try {
      setFormSearchQuery(searchQuery);
      setLoading(true);
      const gateway = new InternalApiGateway();
      const data = await gateway.searchResidents(user.email, {
        team: team.name,
        searchQuery: searchQuery,
      });
      setLoading(false);
      setResults(data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleFilterToReview = async () => {
    try {
      const gateway = new InternalApiGateway();
      const data = await gateway.filterToReviewEvidenceRequests(
        user.email,
        team.name,
        EvidenceRequestState.FOR_REVIEW
      );
      setResultFilterToReview(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout teamId={team.id} feedbackUrl={feedbackUrl}>
      <Head>
        <title>
          Browse residents | Document Evidence Service | Hackney Council
        </title>
      </Head>
      <h1 className="lbh-heading-h2">Browse residents</h1>
      <ResidentSearchForm handleSearch={handleSearch} />
      {(loading || results) && (
        <h2 className="lbh-heading-h3">
          Search results for: {formSearchQuery}
        </h2>
      )}
      {loading && (
        <TableSkeleton
          columns={['ID', 'Name', 'Email', 'Mobile phone number']}
        />
      )}
      {results && <ResidentSummaryTable residents={results} teamId={team.id} />}
      <div className="govuk-checkboxes__item">
        <input
          type="checkbox"
          name="filterReadyToReview"
          id="filter-ready-to-review"
          className="govuk-checkboxes__input"
          onClick={() => {
            setFilterToReview(!filterToReview);
            handleFilterToReview();
          }}
        />
        <label
          htmlFor="filter-ready-to-review"
          className="govuk-label govuk-checkboxes__label"
          style={{ margin: '0' }}
        >
          Display only residents with documents pending review
        </label>
      </div>
      {/* <Tabs
        tabTitles={['To review (3)', 'All (3)']}
        children={[ */}
      <div key="1">
        {/* <Heading level={HeadingLevels.H3}>To review</Heading> */}
        {!filterToReview ? (
          <ResidentTable residents={evidenceRequests} teamId={team.id} />
        ) : (
          resultFilterToReview && (
            <ResidentTable residents={resultFilterToReview} teamId={team.id} />
          )
        )}
      </div>
      {/* <div key="2">
            <Heading level={HeadingLevels.H3}>All residents</Heading>
            <ResidentTable residents={evidenceRequests} teamId={teamId} />
          </div>,
        ]}
      /> */}
    </Layout>
  );
};

export const getServerSideProps = withAuth<BrowseResidentsProps>(
  async (ctx) => {
    const { teamId } = ctx.query as {
      teamId: string;
    };

    const feedbackUrl = process.env.FEEDBACK_FORM_STAFF_URL as string;

    const user = new RequestAuthorizer().authoriseUser(ctx.req?.headers.cookie);
    const userAuthorizedToViewTeam = TeamHelper.userAuthorizedToViewTeam(
      TeamHelper.getTeamsJson(),
      user,
      teamId
    );

    const team = TeamHelper.getTeamFromId(TeamHelper.getTeamsJson(), teamId);
    if (!userAuthorizedToViewTeam || team === undefined || user === undefined) {
      return {
        redirect: {
          destination: '/teams',
          permanent: false,
        },
      };
    }

    const gateway = new EvidenceApiGateway();
    const evidenceRequests = await gateway.getEvidenceRequests(
      user.email,
      team.name
    );
    // const filteredEvidenceRequests = await gateway.getEvidenceRequests(
    //   user.email,
    //   team.name,
    //   EvidenceRequestState.FOR_REVIEW
    // );
    const filteredEvidenceRequests = '';
    console.log('These are the filtered results', filteredEvidenceRequests);
    return {
      props: {
        evidenceRequests,
        team,
        user,
        feedbackUrl,
        filteredEvidenceRequests,
      },
    };
  }
);

export default BrowseResidents;
