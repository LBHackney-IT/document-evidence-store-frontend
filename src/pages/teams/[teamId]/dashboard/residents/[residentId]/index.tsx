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
import SVGSymbol from 'src/components/SVGSymbol';
import React from 'react';
import ResidentPageTable from '../../../../../../components/ResidentPageTable';
import Link from 'next/link';
import Head from 'next/head';
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
  const [selectedTab, setSelectedTab] = useState('all documents');
  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
    console.log('--->' + tab);
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
      <ResidentPageTable resident={resident} />
      <div className="js-enabled">
        <div className="govuk-tabs lbh-tabs" data-module="govuk-tabs">
          <h2 className="govuk-tabs__title">Contents</h2>
          <ul className="govuk-tabs__list">
            <li
              className={
                'govuk-tabs__list-item' +
                (selectedTab === 'all documents'
                  ? ' govuk-tabs__list-item--selected'
                  : ' ')
              }
            >
              <a
                className="govuk-tabs__tab"
                onClick={() => handleTabClick('all documents')}
                href="#all-documents"
              >
                {' '}
                all documents{' '}
              </a>
            </li>
            <li
              className={
                'govuk-tabs__list-item' +
                (selectedTab === 'Past week'
                  ? ' govuk-tabs__list-item--selected'
                  : ' ')
              }
            >
              <a
                className="govuk-tabs__tab"
                onClick={() => handleTabClick('Past week')}
                href="#past-week"
              >
                {' '}
                Past week{' '}
              </a>
            </li>
          </ul>
          <section
            className={
              'govuk-tabs__panel ' +
              (selectedTab === 'all documents'
                ? ' '
                : 'govuk-tabs__panel--hidden')
            }
            id="all-documents"
          >
            <h2 className="lbh-heading-h2">all documents</h2>
            <table className="govuk-table">
              <thead className="govuk-table__head">
                <tr className="govuk-table__row">
                  <th className="govuk-table__header" scope="col">
                    Case manager
                  </th>
                  <th className="govuk-table__header" scope="col">
                    Cases opened
                  </th>
                  <th className="govuk-table__header" scope="col">
                    Cases closed
                  </th>
                </tr>
              </thead>
              <tbody className="govuk-table__body">
                <tr className="govuk-table__row">
                  <td className="govuk-table__cell">David Francis</td>
                  <td className="govuk-table__cell">3</td>
                  <td className="govuk-table__cell">0</td>
                </tr>
                <tr className="govuk-table__row">
                  <td className="govuk-table__cell">Paul Farmer</td>
                  <td className="govuk-table__cell">1</td>
                  <td className="govuk-table__cell">0</td>
                </tr>
                <tr className="govuk-table__row">
                  <td className="govuk-table__cell">Rita Patel</td>
                  <td className="govuk-table__cell">2</td>
                  <td className="govuk-table__cell">0</td>
                </tr>
              </tbody>
            </table>
          </section>
          <section
            className={
              'govuk-tabs__panel ' +
              (selectedTab === 'Past week' ? ' ' : 'govuk-tabs__panel--hidden')
            }
            id="past-week"
          >
            <h2 className="lbh-heading-h2">Past week</h2>
            <table className="govuk-table">
              <thead className="govuk-table__head">
                <tr className="govuk-table__row">
                  <th className="govuk-table__header" scope="col">
                    Case manager
                  </th>
                  <th className="govuk-table__header" scope="col">
                    Cases opened
                  </th>
                  <th className="govuk-table__header" scope="col">
                    Cases closed
                  </th>
                </tr>
              </thead>
              <tbody className="govuk-table__body">
                <tr className="govuk-table__row">
                  <td className="govuk-table__cell">David Francis</td>
                  <td className="govuk-table__cell">24</td>
                  <td className="govuk-table__cell">18</td>
                </tr>
                <tr className="govuk-table__row">
                  <td className="govuk-table__cell">Paul Farmer</td>
                  <td className="govuk-table__cell">16</td>
                  <td className="govuk-table__cell">20</td>
                </tr>
                <tr className="govuk-table__row">
                  <td className="govuk-table__cell">Rita Patel</td>
                  <td className="govuk-table__cell">24</td>
                  <td className="govuk-table__cell">27</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </div>

      {/*<Tabs>*/}
      {/*  <Tabs.Title>Contents</Tabs.Title>*/}
      {/*  <Tabs.List>*/}
      {/*    <Tab href="#0" selected>*/}
      {/*      Awaiting Submission*/}
      {/*    </Tab>*/}
      {/*    <Tab className="govuk-tabs__tab" href="#1">*/}
      {/*      Past week*/}
      {/*    </Tab>*/}
      {/*    <Tab href="#2">Past month</Tab>*/}
      {/*    <Tab href="#3">Past year</Tab>*/}
      {/*  </Tabs.List>*/}
      {/*  <Tabs.Panel id="0" selected>*/}
      {/*    <Table>*/}
      {/*      {evidenceAwaitingSubmissions &&*/}
      {/*      evidenceAwaitingSubmissions.length > 0 ? (*/}
      {/*        evidenceAwaitingSubmissions.map((item) => (*/}
      {/*          <Table.Cell>*/}
      {/*            <EvidenceAwaitingSubmissionTile*/}
      {/*              key={item.documentType}*/}
      {/*              id={item.documentType}*/}
      {/*              documentType={item.documentType}*/}
      {/*              dateRequested={formatDate(item.dateRequested)}*/}
      {/*              requestedBy={item.requestedBy}*/}
      {/*            />*/}
      {/*          </Table.Cell>*/}
      {/*        ))*/}
      {/*      ) : (*/}
      {/*        <Table.Cell>*/}
      {/*          <h3>There are no documents awaiting submission</h3>*/}
      {/*        </Table.Cell>*/}
      {/*      )}*/}
      {/*    </Table>*/}
      {/*  </Tabs.Panel>*/}

      {/*  <Tabs.Panel id="1">*/}
      {/*    <H2>Past week</H2>*/}
      {/*    <Table head={<Table.Row>rejected</Table.Row>}>*/}
      {/*      <Table.Row>*/}
      {/*        <Table.Cell>David Francis</Table.Cell>*/}
      {/*        <Table.Cell>24</Table.Cell>*/}
      {/*        <Table.Cell>18</Table.Cell>*/}
      {/*      </Table.Row>*/}
      {/*      <Table.Row>*/}
      {/*        <Table.Cell>Paul Farmer</Table.Cell>*/}
      {/*        <Table.Cell>16</Table.Cell>*/}
      {/*        <Table.Cell>20</Table.Cell>*/}
      {/*      </Table.Row>*/}
      {/*      <Table.Row>*/}
      {/*        <Table.Cell>Rita Patel</Table.Cell>*/}
      {/*        <Table.Cell>24</Table.Cell>*/}
      {/*        <Table.Cell>27</Table.Cell>*/}
      {/*      </Table.Row>*/}
      {/*    </Table>*/}
      {/*  </Tabs.Panel>*/}
      {/*  <Tabs.Panel id="1">*/}
      {/*    <H2>Past month</H2>*/}
      {/*    <Table head={<Table.Row>Approved</Table.Row>}>*/}
      {/*      <Table.Row>*/}
      {/*        <Table.Cell>David Francis</Table.Cell>*/}
      {/*        <Table.Cell>98</Table.Cell>*/}
      {/*        <Table.Cell>95</Table.Cell>*/}
      {/*      </Table.Row>*/}
      {/*      <Table.Row>*/}
      {/*        <Table.Cell>Paul Farmer</Table.Cell>*/}
      {/*        <Table.Cell>122</Table.Cell>*/}
      {/*        <Table.Cell>133</Table.Cell>*/}
      {/*      </Table.Row>*/}
      {/*      <Table.Row>*/}
      {/*        <Table.Cell>Rita Patel</Table.Cell>*/}
      {/*        <Table.Cell>126</Table.Cell>*/}
      {/*        <Table.Cell>142</Table.Cell>*/}
      {/*      </Table.Row>*/}
      {/*    </Table>*/}
      {/*  </Tabs.Panel>*/}
      {/*  <Tabs.Panel id="1">*/}
      {/*    <H2>Past year</H2>*/}
      {/*    <Table head={<Table.Row> Awaiting Submission</Table.Row>}>*/}
      {/*      <Table.Row>*/}
      {/*        <Table.Cell>David Francis</Table.Cell>*/}
      {/*        <Table.Cell>1380</Table.Cell>*/}
      {/*        <Table.Cell></Table.Cell>*/}
      {/*      </Table.Row>*/}
      {/*      <Table.Row>*/}
      {/*        <Table.Cell>Paul Farmer</Table.Cell>*/}
      {/*        <Table.Cell>1129</Table.Cell>*/}
      {/*        <Table.Cell>1083</Table.Cell>*/}
      {/*      </Table.Row>*/}
      {/*      <Table.Row>*/}
      {/*        <Table.Cell>Rita Patel</Table.Cell>*/}
      {/*        <Table.Cell>1539</Table.Cell>*/}
      {/*        <Table.Cell>1265</Table.Cell>*/}
      {/*      </Table.Row>*/}
      {/*    </Table>*/}
      {/*  </Tabs.Panel>*/}
      {/*</Tabs>*/}

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
