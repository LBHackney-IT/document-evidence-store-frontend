import { useMemo, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Layout from 'src/components/DashboardLayout';
import {
  DocumentSubmission,
  IDocumentSubmission,
} from 'src/domain/document-submission';
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
import { EvidenceAwaitingSubmissionTile } from 'src/components/EvidenceAwaitingSubmissionTile';
import { DateTime } from 'luxon';

type ResidentPageProps = {
  evidenceRequests: EvidenceRequest[];
  documentSubmissions: DocumentSubmission[];
  resident: Resident;
  teamId: string;
  feedbackUrl: string;
};

type EvidenceAwaitingSubmission = {
  documentType: string;
  dateRequested: DateTime | undefined;
  requestedBy: string | undefined;
  kind: 'EvidenceAwaitingSubmission';
};

type DocumentSubmissionWithKind = IDocumentSubmission & {
  kind: 'DocumentSubmissionWithKind';
};

type DocumentTabItem = DocumentSubmissionWithKind | EvidenceAwaitingSubmission;

type DocumentTab = {
  id: string;
  humanReadableName: string;
  documents: DocumentTabItem[];
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

  const toReviewDocumentSubmissions = documentSubmissions
    .filter((ds) => ds.state == 'UPLOADED' && ds.document?.fileType)
    .map<DocumentSubmissionWithKind>((ds) => ({
      ...ds,
      kind: 'DocumentSubmissionWithKind',
    }));
  const reviewedDocumentSubmissions = documentSubmissions
    .filter((ds) => ds.state == 'APPROVED')
    .map<DocumentSubmissionWithKind>((ds) => ({
      ...ds,
      kind: 'DocumentSubmissionWithKind',
    }));
  const rejectedDocumentSubmissions = documentSubmissions
    .filter((ds) => ds.state == 'REJECTED')
    .map<DocumentSubmissionWithKind>((ds) => ({
      ...ds,
      kind: 'DocumentSubmissionWithKind',
    }));

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
          kind: 'EvidenceAwaitingSubmission',
        });
      });
    });
    return awaitingSubmissions;
  }, [evidenceRequests, documentSubmissions]);

  const DocumentTabs: DocumentTab[] = [
    {
      id: 'all-documents',
      humanReadableName: 'All documents',
      documents: evidenceAwaitingSubmissions, //TODO: join all the documents here
    },
    {
      id: 'awaiting-submission',
      humanReadableName: 'Awaiting submission',
      documents: evidenceAwaitingSubmissions,
    },
    {
      id: 'pending-review',
      humanReadableName: 'Pending review',
      documents: toReviewDocumentSubmissions,
    },
    {
      id: 'approved',
      humanReadableName: 'Approved',
      documents: reviewedDocumentSubmissions,
    },
    {
      id: 'rejected',
      humanReadableName: 'Rejected',
      documents: rejectedDocumentSubmissions,
    },
  ];

  const [selectedTab, setSelectedTab] = useState('all-documents');

  const handleTabClick = (tab: string) => {
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

  const getReason = (id: string) => {
    const evidenceRequest = evidenceRequests.find((er) => er.id === id);
    return evidenceRequest?.reason;
  };

  const getUserRequestedBy = (id: string) => {
    const evidenceRequest = evidenceRequests.find((er) => er.id === id);
    return evidenceRequest?.userRequestedBy;
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
            {DocumentTabs.map((documentTab) => {
              return (
                <li className={selectTab(documentTab.id)}>
                  <a
                    className="govuk-tabs__tab"
                    onClick={() => handleTabClick(documentTab.id)}
                    href={'#' + documentTab.id}
                  >
                    <h2 className="govuk-body">
                      {documentTab.humanReadableName}
                    </h2>
                  </a>
                </li>
              );
            })}
          </ul>
          {DocumentTabs.map((documentTab) => {
            return (
              <section
                className={showPanel(documentTab.id)}
                id={documentTab.id}
              >
                <table className="govuk-table">
                  <tbody className="govuk-table__body">
                    <thead className="govuk-table__head">
                      <tr className="govuk-table__row">
                        {/*          className="toReview govuk-form-group--error"*/}
                        {/*          style={{*/}
                        {/*            borderLeftColor: '#FFF6BB',*/}
                        {/*          }}*/}

                        {/*        className="toReview govuk-form-group--error"*/}
                        {/*        style={{*/}
                        {/*          borderLeftColor: '#8EB6DC',*/}
                        {/*        }}*/}

                        {/*      className="toReview govuk-form-group--error"*/}
                        {/*      style={{*/}
                        {/*        borderLeftColor: '#B2DFDB',*/}
                        {/*      }}*/}

                        {/*      className="toReview govuk-form-group--error"*/}
                        {/*      style={{*/}
                        {/*        borderLeftColor: '#F8D1CD',*/}
                        {/*      }}*/}
                        <EvidenceList>
                          {documentTab.documents &&
                          documentTab.documents.length > 0 ? (
                            documentTab.documents.map(
                              (documentTabItem: DocumentTabItem, index) => {
                                switch (documentTabItem.kind) {
                                  case 'DocumentSubmissionWithKind':
                                    return (
                                      <EvidenceTile
                                        teamId={teamId}
                                        residentId={residentId}
                                        key={documentTabItem.id}
                                        id={documentTabItem.id}
                                        title={
                                          documentTabItem
                                            .staffSelectedDocumentType?.title ||
                                          documentTabItem.documentType.title
                                        }
                                        createdAt={formatDate(
                                          documentTabItem.createdAt
                                        )}
                                        fileSizeInBytes={
                                          documentTabItem.document
                                            ? documentTabItem.document
                                                .fileSizeInBytes
                                            : 0
                                        }
                                        format={
                                          documentTabItem.document
                                            ? documentTabItem.document.extension
                                            : 'unknown'
                                        }
                                        state={documentTabItem.state}
                                        reason={getReason(
                                          documentTabItem.evidenceRequestId
                                        )}
                                        requestedBy={getUserRequestedBy(
                                          documentTabItem.evidenceRequestId
                                        )}
                                      />
                                    );
                                  case 'EvidenceAwaitingSubmission':
                                    // return 'hello';
                                    return (
                                      <EvidenceAwaitingSubmissionTile
                                        id={index}
                                        documentType={
                                          documentTabItem.documentType
                                        }
                                        dateRequested={
                                          documentTabItem.dateRequested
                                        }
                                        requestedBy={
                                          documentTabItem.requestedBy
                                        }
                                      />
                                    );
                                }
                              }
                            )
                          ) : (
                            <h3>There are no documents to review</h3>
                          )}
                        </EvidenceList>
                      </tr>
                    </thead>
                  </tbody>
                </table>
              </section>
            );
          })}
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
