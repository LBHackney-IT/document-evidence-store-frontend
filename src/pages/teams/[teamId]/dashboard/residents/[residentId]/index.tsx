import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from 'src/components/DashboardLayout';
import { DocumentSubmission } from 'src/domain/document-submission';
import { EvidenceApiGateway } from 'src/gateways/evidence-api';
import { Resident } from 'src/domain/resident';
import { EvidenceList, EvidenceTile } from 'src/components/EvidenceTile';
import { withAuth, WithUser } from 'src/helpers/authed-server-side-props';
import { RequestAuthorizer } from '../../../../../../services/request-authorizer';
import { TeamHelper } from '../../../../../../services/team-helper';
import { formatDate } from '../../../../../../helpers/formatters';

type ResidentPageProps = {
  documentSubmissions: DocumentSubmission[];
  resident: Resident;
  teamId: string;
};

const ResidentPage: NextPage<WithUser<ResidentPageProps>> = ({
  documentSubmissions,
  resident,
  teamId,
}) => {
  const router = useRouter();
  const { residentId } = router.query as {
    residentId: string;
  };
  const toReviewDocumentSubmissions = documentSubmissions.filter(
    (ds) => ds.state == 'UPLOADED' && ds.document?.fileType
  );
  const reviewedDocumentSubmissions = documentSubmissions.filter(
    (ds) => ds.state == 'APPROVED'
  );
  const rejectedDocumentSubmissions = documentSubmissions.filter(
    (ds) => ds.state == 'REJECTED'
  );
  console.log('rejectedDocumentSubmissions', rejectedDocumentSubmissions);

  return (
    <Layout teamId={teamId}>
      <Head>
        <title>{resident.name}</title>
      </Head>
      <h1 className="lbh-heading-h2">{resident.name}</h1>
      <p className="lbh-body">{resident.phoneNumber}</p>
      <p className="lbh-body">{resident.email}</p>

      <div className="toReview">
        <h2 className="lbh-heading-h3">To review</h2>

        <EvidenceList>
          {toReviewDocumentSubmissions &&
          toReviewDocumentSubmissions.length > 0 ? (
            toReviewDocumentSubmissions.map((ds) => (
              <EvidenceTile
                teamId={teamId}
                residentId={residentId}
                key={ds.id}
                id={ds.id}
                title={String(ds.documentType.title)}
                createdAt={formatDate(ds.createdAt)}
                fileSizeInBytes={ds.document ? ds.document.fileSizeInBytes : 0}
                format={ds.document ? ds.document.extension : 'unknown'}
                // purpose="Example form"
                toReview
              />
            ))
          ) : (
            <h3>There are no documents to review</h3>
          )}
        </EvidenceList>
      </div>

      <div className="reviewed">
        <h2 className="lbh-heading-h3">Reviewed</h2>

        <EvidenceList twoColumns>
          {reviewedDocumentSubmissions &&
          reviewedDocumentSubmissions.length > 0 ? (
            reviewedDocumentSubmissions.map((ds) => (
              <EvidenceTile
                teamId={teamId}
                residentId={residentId}
                key={ds.id}
                id={ds.id}
                title={String(ds.staffSelectedDocumentType?.title)}
                createdAt={formatDate(ds.createdAt)}
                fileSizeInBytes={ds.document ? ds.document.fileSizeInBytes : 0}
                format={ds.document ? ds.document.extension : 'unknown'}
                // purpose="Example form"
              />
            ))
          ) : (
            <h3>There are no reviewed documents</h3>
          )}
        </EvidenceList>
      </div>

      {rejectedDocumentSubmissions &&
        rejectedDocumentSubmissions.length > 0 &&
        rejectedDocumentSubmissions.map((ds) => (
          <div className="rejected">
            <h2 className="lbh-heading-h3">Rejected</h2>

            <EvidenceList twoColumns>
              <EvidenceTile
                teamId={teamId}
                residentId={residentId}
                key={ds.id}
                id={ds.id}
                title={String(ds.staffSelectedDocumentType?.title)}
                createdAt={formatDate(ds.createdAt)}
                fileSizeInBytes={ds.document ? ds.document.fileSizeInBytes : 0}
                format={ds.document ? ds.document.extension : 'unknown'}
                // purpose="Example form"
              />
            </EvidenceList>
          </div>
        ))}
    </Layout>
  );
};

export const getServerSideProps = withAuth<ResidentPageProps>(async (ctx) => {
  const { teamId, residentId } = ctx.query as {
    teamId: string;
    residentId: string;
  };

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
  const documentSubmissions = await gateway.getDocumentSubmissionsForResident(
    user.email,
    team.name,
    residentId
  );
  const resident = await gateway.getResident(user.email, residentId);
  return {
    props: { documentSubmissions, resident, teamId },
  };
});

export default ResidentPage;
