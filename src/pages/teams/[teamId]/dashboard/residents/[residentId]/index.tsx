import { useMemo, useState } from 'react';
import { NextPage } from 'next';
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
// import SVGSymbol from 'src/components/SVGSymbol';
import React from 'react';
import ResidentDetailsTable from '../../../../../../components/ResidentDetailsTable';
import Link from 'next/link';
import Head from 'next/head';
import { EvidenceRequestState } from 'src/domain/enums/EvidenceRequestState';
import { EvidenceRequest } from 'src/domain/evidence-request';
import { DocumentType } from 'src/domain/document-type';
import { DateTime } from 'luxon';
import { EvidenceAwaitingSubmissionTile } from 'src/components/EvidenceAwaitingSubmissionTile';
import { DocumentSubmissionTabState } from '../../../../../../domain/enums/DocumentSubmissionTabState';

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
  const [selectedTab, setSelectedTab] = useState(
    DocumentSubmissionTabState.ALL_DOCUMENTS
  );

  const handleTabClick = (tab: DocumentSubmissionTabState) => {
    setSelectedTab(tab);
  };

  const selectTab = (tabName: string) => {
    if (selectedTab === tabName) {
      return 'govuk-tabs__list-item  govuk-tabs__list-item--selected';
    } else return 'govuk-tabs__list-item';
  };

  const showPanel = (tabName: string) => {
    if (selectedTab === tabName) {
      return 'govuk-tabs__panel';
    } else return 'govuk-tabs__panel govuk-tabs__panel--hidden';
  };

  interface EvidenceAwaitingSubmission {
    documentType: string;
    dateRequested: DateTime | undefined;
    requestedBy: string | undefined;
  }
  const evidenceAwaitingSubmissions = useMemo(() => {
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
  }, [evidenceRequests, documentSubmissions]);

  const getReason = (id: string) => {
    const evidenceRequest = evidenceRequests.find((er) => er.id === id);
    return evidenceRequest?.reason;
  };

  const getUserRequestedBy = (id: string) => {
    for (let i = 0; i < evidenceRequests.length; i++) {
      if (evidenceRequests[i].id === id) {
        return evidenceRequests[i].userRequestedBy;
        break;
      } else return evidenceRequests[0].userRequestedBy;
    }
  };

  return (
    <Layout teamId={teamId} feedbackUrl={feedbackUrl}>
      <Head>
        <title>
          {resident.name} | Document Evidence Service | Hackney Council
        </title>
      </Head>
      <h1 className="lbh-heading-h2">
        <Link href={`/teams/${teamId}/dashboard`}>
          <a className="lbh-link" data-testid="search-page">
            Search page
          </a>
        </Link>
        <img src="/divider.svg" alt="" className="lbu-divider" />
        {resident.name}
      </h1>
      <ResidentDetailsTable resident={resident} />
      <div
        className="js-enabled"
        style={{
          paddingTop: '1.5em',
        }}
      >
        <div className="govuk-tabs lbh-tabs" data-module="govuk-tabs">
          <ul className="govuk-tabs__list">
            <li className={selectTab(DocumentSubmissionTabState.ALL_DOCUMENTS)}>
              <a
                className="govuk-tabs__tab"
                onClick={() =>
                  handleTabClick(DocumentSubmissionTabState.ALL_DOCUMENTS)
                }
                href={'#All-documents'}
              >
                <h2 className="govuk-body">All documents</h2>
              </a>
            </li>
            <li
              className={selectTab(
                DocumentSubmissionTabState.AWAITING_SUBMISSION
              )}
            >
              <a
                className="govuk-tabs__tab"
                onClick={() =>
                  handleTabClick(DocumentSubmissionTabState.AWAITING_SUBMISSION)
                }
                href={'#' + DocumentSubmissionTabState.AWAITING_SUBMISSION}
              >
                <h2 className="govuk-body">Awaiting submission</h2>
              </a>
            </li>
            <li
              className={selectTab(DocumentSubmissionTabState.PENDING_REVIEW)}
            >
              <a
                className="govuk-tabs__tab"
                onClick={() =>
                  handleTabClick(DocumentSubmissionTabState.PENDING_REVIEW)
                }
                href={'#' + DocumentSubmissionTabState.PENDING_REVIEW}
              >
                <h2 className="govuk-body">Pending Review</h2>
              </a>
            </li>
            <li className={selectTab(DocumentSubmissionTabState.APPROVED)}>
              <a
                className="govuk-tabs__tab"
                onClick={() =>
                  handleTabClick(DocumentSubmissionTabState.APPROVED)
                }
                href={'#' + DocumentSubmissionTabState.APPROVED}
              >
                <h2 className="govuk-body">Approved</h2>
              </a>
            </li>
            <li className={selectTab(DocumentSubmissionTabState.REJECTED)}>
              <a
                className="govuk-tabs__tab"
                onClick={() =>
                  handleTabClick(DocumentSubmissionTabState.REJECTED)
                }
                href={'#' + DocumentSubmissionTabState.REJECTED}
              >
                <h2 className="govuk-body">Rejected</h2>
              </a>
            </li>
          </ul>
          <section
            className={
              'govuk-tabs__panel ' +
              (selectedTab === DocumentSubmissionTabState.ALL_DOCUMENTS
                ? ' '
                : 'govuk-tabs__panel--hidden')
            }
            id={DocumentSubmissionTabState.ALL_DOCUMENTS}
          >
            <table className="govuk-table">
              <tbody className="govuk-table__body">
                <thead className="govuk-table__head">
                  <tr className="govuk-table__row">
                    <EvidenceList>
                      {evidenceAwaitingSubmissions &&
                        evidenceAwaitingSubmissions.length > 0 &&
                        evidenceAwaitingSubmissions.map((evidence) => (
                          <EvidenceAwaitingSubmissionTile
                            id={evidence.documentType}
                            documentType={evidence.documentType}
                            dateRequested={formatDate(evidence.dateRequested)}
                            requestedBy={evidence.requestedBy}
                          />
                        ))}
                      {evidenceAwaitingSubmissions ||
                      (documentSubmissions &&
                        documentSubmissions.length > 0) ? (
                        documentSubmissions.map((ds) => (
                          <EvidenceTile
                            teamId={teamId}
                            residentId={residentId}
                            key={ds.id}
                            id={ds.id}
                            title={String(ds.documentType.title)}
                            createdAt={formatDate(ds.createdAt)}
                            fileSizeInBytes={
                              ds.document ? ds.document.fileSizeInBytes : 0
                            }
                            format={
                              ds.document ? ds.document.extension : 'unknown'
                            }
                            state={ds.state}
                            reason={getReason(ds.evidenceRequestId)}
                            requestedBy={getUserRequestedBy(
                              ds.evidenceRequestId
                            )}
                          />
                        ))
                      ) : (
                        <h3>There are no documents to review</h3>
                      )}
                    </EvidenceList>
                  </tr>
                </thead>
              </tbody>
            </table>
          </section>
          {/*Awaiting submission*/}
          <section
            className={showPanel(
              DocumentSubmissionTabState.AWAITING_SUBMISSION
            )}
            id={DocumentSubmissionTabState.AWAITING_SUBMISSION}
          >
            <table className="govuk-table">
              <tbody className="govuk-table__body">
                <tr className="govuk-table__row">
                  <div
                    className="toReview govuk-form-group--error"
                    style={{
                      borderLeftColor: '#FFF6BB',
                    }}
                  >
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
                </tr>
              </tbody>
            </table>
          </section>
          {/*Pending Review*/}
          <section
            className={showPanel(DocumentSubmissionTabState.PENDING_REVIEW)}
            id={DocumentSubmissionTabState.PENDING_REVIEW}
          >
            <table className="govuk-table">
              <tbody className="govuk-table__body">
                <div
                  className="toReview govuk-form-group--error"
                  style={{
                    borderLeftColor: '#8EB6DC',
                  }}
                >
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
                          fileSizeInBytes={
                            ds.document ? ds.document.fileSizeInBytes : 0
                          }
                          format={
                            ds.document ? ds.document.extension : 'unknown'
                          }
                          // purpose="Example form"
                          toReview
                          state={ds.state}
                          reason={getReason(ds.evidenceRequestId)}
                          requestedBy={getUserRequestedBy(ds.evidenceRequestId)}
                        />
                      ))
                    ) : (
                      <h3>There are no documents to review</h3>
                    )}
                  </EvidenceList>
                </div>
              </tbody>
            </table>
          </section>
          {/*Approved*/}
          <section
            className={showPanel(DocumentSubmissionTabState.APPROVED)}
            id={DocumentSubmissionTabState.APPROVED}
          >
            <table className="govuk-table">
              <div
                className="toReview govuk-form-group--error"
                style={{
                  borderLeftColor: '#B2DFDB',
                }}
              >
                <tbody className="govuk-table__body">
                  <tr className="govuk-table__row">
                    <EvidenceList>
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
                            fileSizeInBytes={
                              ds.document ? ds.document.fileSizeInBytes : 0
                            }
                            format={
                              ds.document ? ds.document.extension : 'unknown'
                            }
                            // purpose="Example form"
                            state={ds.state}
                            reason={getReason(ds.evidenceRequestId)}
                            requestedBy={getUserRequestedBy(
                              ds.evidenceRequestId
                            )}
                          />
                        ))
                      ) : (
                        <h3>There are no approved documents</h3>
                      )}
                    </EvidenceList>
                  </tr>
                </tbody>
              </div>
            </table>
          </section>
          {/*Rejected*/}
          <section
            className={showPanel(DocumentSubmissionTabState.REJECTED)}
            id={DocumentSubmissionTabState.REJECTED}
          >
            <table className="govuk-table">
              <div
                className="toReview govuk-form-group--error"
                style={{
                  borderLeftColor: '#F8D1CD',
                }}
              >
                <tbody className="govuk-table__body">
                  <tr className="govuk-table__row">
                    <EvidenceList>
                      {rejectedDocumentSubmissions &&
                      rejectedDocumentSubmissions.length > 0 ? (
                        rejectedDocumentSubmissions.map((ds) => (
                          <EvidenceTile
                            teamId={teamId}
                            residentId={residentId}
                            key={ds.id}
                            id={ds.id}
                            title={String(ds.documentType.title)}
                            createdAt={formatDate(ds.createdAt)}
                            fileSizeInBytes={
                              ds.document ? ds.document.fileSizeInBytes : 0
                            }
                            format={
                              ds.document ? ds.document.extension : 'unknown'
                            }
                            state={ds.state}
                            reason={getReason(ds.evidenceRequestId)}
                            requestedBy={getUserRequestedBy(
                              ds.evidenceRequestId
                            )}
                          />
                        ))
                      ) : (
                        <h3>There are no rejected documents</h3>
                      )}
                    </EvidenceList>
                  </tr>
                </tbody>
              </div>
            </table>
          </section>
        </div>
      </div>
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
