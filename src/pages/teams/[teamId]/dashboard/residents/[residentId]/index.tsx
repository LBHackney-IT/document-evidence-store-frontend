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
import SVGSymbol from 'src/components/SVGSymbol';
import { EvidenceRequestState } from 'src/domain/enums/EvidenceRequestState';
import { EvidenceRequest } from 'src/domain/evidence-request';
import { DocumentType } from 'src/domain/document-type';
import { DateTime } from 'luxon';
import { EvidenceAwaitingSubmissionTile } from 'src/components/EvidenceAwaitingSubmissionTile';

type ResidentPageProps = {
  evidenceRequests: EvidenceRequest[];
  documentSubmissions: DocumentSubmission[];
  resident: Resident;
  teamId: string;
  feedbackUrl: string;
};

const ResidentPage: NextPage<WithUser<ResidentPageProps>> = ({
  evidenceRequests,
  documentSubmissions,
  resident,
  teamId,
  feedbackUrl,
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

  interface EvidenceAwaitingSubmission {
    documentType: string;
    dateRequested: DateTime | undefined;
    requestedBy: string | undefined;
  }
  const findEvidenceAwaitingSubmissions = () => {
    const documentTypesMap = new Map<string, Set<DocumentType>>();
    evidenceRequests.forEach((er) =>
      documentTypesMap.set(er.id, new Set(er.documentTypes))
    );
    documentSubmissions.forEach((ds) => {
      const currentDocumentTypesSet = documentTypesMap.get(
        ds.evidenceRequestId
      );

      currentDocumentTypesSet?.forEach((dt) => {
        if (dt.id === ds.documentType.id) {
          currentDocumentTypesSet.delete(dt);
        }
      });
    });
    const awaitingSubmissions: EvidenceAwaitingSubmission[] = [];
    documentTypesMap.forEach((value, key) => {
      value.forEach((dt) => {
        const evidenceRequestFromKey = evidenceRequests.find(
          (er) => er.id == key
        );
        awaitingSubmissions.push({
          documentType: dt.title,
          dateRequested: evidenceRequestFromKey?.createdAt,
          requestedBy: evidenceRequestFromKey?.userRequestedBy,
        });
      });
    });
    return awaitingSubmissions;
  };
  const evidenceAwaitingSubmissions = findEvidenceAwaitingSubmissions();

  return (
    <Layout teamId={teamId} feedbackUrl={feedbackUrl}>
      <Head>
        <title>
          {resident.name} | Document Evidence Service | Hackney Council
        </title>
      </Head>
      <h1 className="lbh-heading-h2">{resident.name}</h1>
      <p className="lbh-body">{resident.phoneNumber}</p>
      <p className="lbh-body">{resident.email}</p>

      <div className="awaitingSubmission evidence-list">
        <h2 className="lbh-heading-h3">Awaiting submission</h2>
        <EvidenceList>
          {evidenceAwaitingSubmissions &&
          evidenceAwaitingSubmissions.length > 0 ? (
            evidenceAwaitingSubmissions.map((item) => (
              <EvidenceAwaitingSubmissionTile
                key={item.documentType}
                id={item.documentType}
                documentType={item.documentType}
                dateRequested={formatDate(item.dateRequested)}
                requestedBy={item.requestedBy}
              />
            ))
          ) : (
            <h3>There are no documents awaiting submission</h3>
          )}
        </EvidenceList>
      </div>

      <div
        className="toReview govuk-form-group--error"
        style={{
          borderLeftColor: '#F0D232',
          backgroundColor: '#FFFBF4',
          paddingTop: '1.5em',
        }}
      >
        <h2 className="lbh-heading-h3">
          <SVGSymbol status="toReview" />
          Pending review
        </h2>

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

      <div className="reviewed evidence-list">
        <h2 className="lbh-heading-h3">
          <SVGSymbol status="reviewed" />
          Reviewed
        </h2>

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

      {rejectedDocumentSubmissions && rejectedDocumentSubmissions.length > 0 && (
        <div className="rejected evidence-list">
          <h2 className="lbh-heading-h3">
            <SVGSymbol status="rejected" />
            Rejected
          </h2>

          <EvidenceList twoColumns>
            {rejectedDocumentSubmissions.map((ds) => (
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
              />
            ))}
          </EvidenceList>
        </div>
      )}
    </Layout>
  );
};

export const getServerSideProps = withAuth<ResidentPageProps>(async (ctx) => {
  const { teamId, residentId } = ctx.query as {
    teamId: string;
    residentId: string;
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
  const documentSubmissionsPromise = gateway.getDocumentSubmissionsForResident(
    user.email,
    team.name,
    residentId
  );
  const pendingEvidenceRequestsPromise = gateway.getEvidenceRequests(
    user.email,
    team.name,
    residentId,
    EvidenceRequestState.PENDING
  );
  const forReviewEvidenceRequestsPromise = gateway.getEvidenceRequests(
    user.email,
    team.name,
    residentId,
    EvidenceRequestState.FOR_REVIEW
  );
  const residentPromise = gateway.getResident(user.email, residentId);

  const [
    documentSubmissions,
    pendingEvidenceRequests,
    forReviewEvidenceRequests,
    resident,
  ] = await Promise.all([
    documentSubmissionsPromise,
    pendingEvidenceRequestsPromise,
    forReviewEvidenceRequestsPromise,
    residentPromise,
  ]);

  const evidenceRequests = pendingEvidenceRequests.concat(
    forReviewEvidenceRequests
  );
  return {
    props: {
      evidenceRequests,
      documentSubmissions,
      resident,
      teamId,
      feedbackUrl,
    },
  };
});

export default ResidentPage;
