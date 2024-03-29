import { NextPage } from 'next';
import Head from 'next/head';
import { EvidenceRequest } from 'src/domain/evidence-request';
import { EvidenceApiGateway } from 'src/gateways/evidence-api';
import { withAuth, WithUser } from 'src/helpers/authed-server-side-props';
import Layout from '../../../../../components/DashboardLayout';
import ResidentSearchForm from '../../../../../components/ResidentSearchForm';
import { useCallback, useEffect, useState } from 'react';
import { InternalApiGateway } from '../../../../../gateways/internal-api';
import { Resident } from '../../../../../domain/resident';
import { LinkResidentSummaryTable } from '../../../../../components/LinkResidentSummaryTable';
import TableSkeleton from '../../../../../components/TableSkeleton';
import { RequestAuthorizer } from '../../../../../services/request-authorizer';
import { TeamHelper } from '../../../../../services/team-helper';
import { Team } from '../../../../../domain/team';
import { User } from '../../../../../domain/user';
import { useRouter } from 'next/router';

type DeeplinkSearchProps = {
  evidenceRequests: EvidenceRequest[];
  team: Team;
  user: User;
  feedbackUrl: string;
};

const DeeplinkSearch: NextPage<WithUser<DeeplinkSearchProps>> = ({
  team,
  user,
  feedbackUrl,
}) => {
  const router = useRouter();
  const searchTermQuery = String(router.query['searchTerm']);
  const groupIdQuery = router.query['groupId'];
  const nameQuery = router.query['name'];
  const phoneQuery = router.query['phone'];
  const emailQuery = router.query['email'];
  const [results, setResults] = useState<Resident[]>();
  const [formSearchQuery, setFormSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const gateway = new InternalApiGateway();

  const checkForExistingLinkByGroupId = async (
    groupId: string
  ): Promise<boolean> => {
    if (!groupIdQuery) {
      return false;
    }
    const linkedResident = await gateway.searchResidents(user.email, {
      groupId: groupId,
    });
    if (linkedResident.length == 1) {
      router.push(
        `/teams/${team.id}/dashboard/residents/${linkedResident[0].id}`
      );
      return true;
    }
    return false;
  };

  const handleSearch = useCallback(async (searchQuery: string) => {
    try {
      setFormSearchQuery(searchQuery);
      setLoading(true);
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

  useEffect(() => {
    checkForExistingLinkByGroupId(String(groupIdQuery)).then((isFound) => {
      if (!isFound) {
        handleSearch(searchTermQuery);
      }
    });
  }, []);

  return (
    <Layout teamId={team.id} feedbackUrl={feedbackUrl}>
      <Head>
        <title>
          Link Resident | Document Evidence Service | Hackney Council
        </title>
      </Head>
      <h1 className="lbh-heading-h2">Link Resident</h1>
      <ResidentSearchForm
        handleSearch={handleSearch}
        teamId={team.id}
        isFromDeeplink={true}
        name={nameQuery}
        phone={phoneQuery}
        email={emailQuery}
        groupId={groupIdQuery}
      />
      {(loading || results) && (
        <h2 className="lbh-heading-h3">Found results for: {formSearchQuery}</h2>
      )}
      {loading && (
        <TableSkeleton
          columns={['ID', 'Name', 'Email', 'Mobile phone number']}
        />
      )}
      {results && (
        <LinkResidentSummaryTable residents={results} team={team} user={user} />
      )}
    </Layout>
  );
};

export const getServerSideProps = withAuth<DeeplinkSearchProps>(async (ctx) => {
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
  return {
    props: {
      evidenceRequests,
      team,
      user,
      feedbackUrl,
    },
  };
});

export default DeeplinkSearch;
