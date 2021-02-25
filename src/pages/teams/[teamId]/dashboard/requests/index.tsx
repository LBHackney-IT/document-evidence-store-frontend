import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from 'src/components/DashboardLayout';
import { EvidenceRequestState } from 'src/domain/enums/EvidenceRequestState';
import { EvidenceRequest } from 'src/domain/evidence-request';
import { EvidenceApiGateway } from 'src/gateways/evidence-api';
import { withAuth, WithUser } from 'src/helpers/authed-server-side-props';
import { EvidenceRequestTable } from '../../../../../components/EvidenceRequestTable';

type RequestsIndexPageProps = {
  evidenceRequests: EvidenceRequest[];
};

const RequestsIndexPage: NextPage<WithUser<RequestsIndexPageProps>> = ({
  evidenceRequests,
}) => {
  const router = useRouter();
  const { teamId } = router.query as {
    teamId: string;
  };

  return (
    <Layout teamId={teamId}>
      <Head>
        <title>Pending requests</title>
      </Head>
      <h1 className="lbh-heading-h2">Pending requests</h1>
      <EvidenceRequestTable requests={evidenceRequests} />
      <Link href={`/teams/${teamId}/dashboard/requests/new`}>
        <a className="govuk-button lbh-button">New request</a>
      </Link>
    </Layout>
  );
};

export const getServerSideProps = withAuth<RequestsIndexPageProps>(async () => {
  const gateway = new EvidenceApiGateway();
  const evidenceRequests = await gateway.getEvidenceRequests(
    EvidenceRequestState.PENDING
  );
  return {
    props: { evidenceRequests },
  };
});

export default RequestsIndexPage;
