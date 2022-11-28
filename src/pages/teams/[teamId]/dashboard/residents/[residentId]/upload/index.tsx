import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'src/components/DashboardLayout';
import { DocumentType } from '../../../../../../../domain/document-type';
import { withAuth, WithUser } from 'src/helpers/authed-server-side-props';
import StaffUploaderForm from 'src/components/StaffUploaderForm';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { TeamHelper } from 'src/services/team-helper';
import { EvidenceApiGateway } from 'src/gateways/evidence-api';
import { RequestAuthorizer } from 'src/services/request-authorizer';
import { Team } from 'src/domain/team';

type UploadPageProps = {
  userEmail: string;
  teamId: string;
  team: Team;
  residentId: string;
  feedbackUrl: string;
  staffSelectedDocumentTypes: DocumentType[];
};

const UploadPage: NextPage<WithUser<UploadPageProps>> = ({
  userEmail,
  teamId,
  team,
  residentId,
  feedbackUrl,
  staffSelectedDocumentTypes,
}) => {
  const router = useRouter();
  const onSuccess = useCallback(() => {
    router.push(`/teams/${teamId}/dashboard/residents/${residentId}`);
  }, []);
  return (
    <Layout teamId={teamId} feedbackUrl={feedbackUrl}>
      <Head>
        <title>Upload | Document Evidence Service | Hackney Council</title>
      </Head>
      <h1 data-testid="upload-documents-h1" className="lbh-heading-h2">
        Upload documents
      </h1>
      <StaffUploaderForm
        userEmail={userEmail}
        residentId={residentId}
        team={team}
        staffSelectedDocumentTypes={staffSelectedDocumentTypes}
        onSuccess={onSuccess}
      />
    </Layout>
  );
};

export const getServerSideProps = withAuth<UploadPageProps>(async (ctx) => {
  const { teamId, residentId } = ctx.query as {
    teamId: string;
    residentId: string;
  };
  const feedbackUrl = process.env.FEEDBACK_FORM_STAFF_URL as string;
  const evidenceApiGateway = new EvidenceApiGateway();
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
  const userEmail = user.email;
  const staffSelectedDocumentTypes = await evidenceApiGateway.getStaffSelectedDocumentTypes(
    userEmail,
    team.name,
    true
  );
  return {
    props: {
      userEmail,
      teamId,
      team,
      residentId,
      feedbackUrl,
      staffSelectedDocumentTypes,
    },
  };
});

export default UploadPage;
