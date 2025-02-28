import React, { FunctionComponent, useState } from 'react';
import { EvidenceList, EvidenceTile } from './EvidenceTile';
import { formatDate } from '../helpers/formatters';
import { Pagination } from 'src/components/Pagination';
import { EvidenceAwaitingSubmissionTile } from './EvidenceAwaitingSubmissionTile';
import { EvidenceRequest } from '../domain/evidence-request';
import { DateTime } from 'luxon';
import { DocumentSubmission } from '../domain/document-submission';
import styles from '../styles/EvidenceTile.module.scss';

interface Props {
  evidenceRequests: EvidenceRequest[];
  awaitingSubmissions: EvidenceAwaitingSubmission[];
  documentSubmissions: DocumentSubmission[];
  total: number;
  pageSize: number;
  onPageOrTabChange: (page: number, state?: string) => Promise<void>;
}

export type EvidenceAwaitingSubmission = {
  documentType: string;
  dateRequested: DateTime | undefined;
  requestedBy: string | undefined;
  reason: string | undefined;
};

type DocumentTab = {
  id: string;
  humanReadableName: string;
  documentState?: string;
  className: 'govuk-form-group--error' | undefined;
  style: '#FFF6BB' | '#8EB6DC' | '#B2DFDB' | '#F8D1CD' | undefined;
};

export const ResidentDocumentsTable: FunctionComponent<Props> = ({
  evidenceRequests,
  awaitingSubmissions,
  documentSubmissions,
  total,
  pageSize,
  onPageOrTabChange,
}) => {
  const [selectedTab, setSelectedTab] = useState('all-documents');
  const selectTab = (tabName: string) => {
    if (selectedTab === tabName) {
      return 'govuk-tabs__list-item  govuk-tabs__list-item--selected';
    } else return 'govuk-tabs__list-item';
  };
  const handleTabClick = (tab: string, state?: string) => {
    setSelectedTab(tab);
    if (tab == 'awaiting-submission') {
      setHidePagination(true);
    } else {
      setHidePagination(false);
      onPageOrTabChange(1, state);
    }
  };

  const showPanel = (tabName: string) => {
    if (selectedTab === tabName) {
      return 'govuk-tabs__panel';
    } else return 'govuk-tabs__panel govuk-tabs__panel--hidden';
  };

  const DocumentTabs: DocumentTab[] = [
    {
      id: 'all-documents',
      humanReadableName: 'All documents',
      documentState: undefined,
      className: undefined,
      style: undefined,
    },
    {
      id: 'awaiting-submission',
      humanReadableName: 'Awaiting submission',
      className: 'govuk-form-group--error',
      style: '#FFF6BB',
    },
    {
      id: 'pending-review',
      humanReadableName: 'Pending review',
      documentState: 'Uploaded',
      className: 'govuk-form-group--error',
      style: '#8EB6DC',
    },
    {
      id: 'approved',
      humanReadableName: 'Approved',
      documentState: 'Approved',
      className: 'govuk-form-group--error',
      style: '#B2DFDB',
    },
    {
      id: 'rejected',
      humanReadableName: 'Rejected',
      documentState: 'Rejected',
      className: 'govuk-form-group--error',
      style: '#F8D1CD',
    },
  ];

  const getReason = (id: string) => {
    const evidenceRequest = evidenceRequests.find((er) => er.id === id);
    return evidenceRequest?.reason;
  };

  const getUserRequestedBy = (id: string) => {
    const evidenceRequest = evidenceRequests.find((er) => er.id === id);
    return evidenceRequest?.userRequestedBy;
  };

  const [currentPage] = useState(1);
  const [hidePagination, setHidePagination] = useState(false);

  const onPageChange = (targetPage: number) =>
    onPageOrTabChange(targetPage, selectedTab);
  return (
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
              <li
                className={selectTab(documentTab.id)}
                data-testid={`${documentTab.id}-tab`}
                key={`${documentTab.id}-tab`}
              >
                <a
                  className="govuk-tabs__tab"
                  onClick={() =>
                    handleTabClick(documentTab.id, documentTab.documentState)
                  }
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
              data-testid={`${documentTab.id}-section`}
              key={`${documentTab.id}-section`}
            >
              <article
                className={documentTab.className}
                style={{ borderLeftColor: documentTab.style }}
              >
                <EvidenceList>
                  {documentTab.id === 'awaiting-submission' &&
                  awaitingSubmissions &&
                  awaitingSubmissions.length > 0 ? (
                    awaitingSubmissions.map((submission) => (
                      <li
                        className={styles.item}
                        data-testid={`${documentTab.id}-evidence-awaiting-tile`}
                        key={`${documentTab.id}-evidence-awaiting-tile`}
                      >
                        <EvidenceAwaitingSubmissionTile
                          documentType={submission.documentType}
                          dateRequested={submission.dateRequested}
                          requestedBy={submission.requestedBy}
                          reason={submission.reason}
                        />
                      </li>
                    ))
                  ) : documentTab.id != 'awaiting-submission' &&
                    documentSubmissions &&
                    documentSubmissions.length > 0 ? (
                    documentSubmissions.map((documentSubmission) => (
                      <li
                        className={styles.item}
                        data-testid={`${documentTab.id}-evidence-tile`}
                        key={documentSubmission.id}
                      >
                        <EvidenceTile
                          id={documentSubmission.id}
                          documentDescription={
                            documentSubmission.document?.description
                          }
                          title={
                            documentSubmission.staffSelectedDocumentType
                              ?.title || documentSubmission.documentType?.title
                          }
                          createdAt={formatDate(documentSubmission.createdAt)}
                          fileSizeInBytes={
                            documentSubmission.document
                              ? documentSubmission.document.fileSizeInBytes
                              : 0
                          }
                          format={
                            documentSubmission.document
                              ? documentSubmission.document.extension
                              : 'unknown'
                          }
                          state={documentSubmission.state}
                          reason={
                            documentSubmission.evidenceRequestId &&
                            getReason(documentSubmission.evidenceRequestId)
                          }
                          requestedBy={
                            documentSubmission.evidenceRequestId &&
                            getUserRequestedBy(
                              documentSubmission.evidenceRequestId
                            )
                          }
                          userUpdatedBy={documentSubmission.userUpdatedBy}
                        />
                      </li>
                    ))
                  ) : (
                    <h3>There are no documents to review</h3>
                  )}
                </EvidenceList>
              </article>
            </section>
          );
        })}
      </div>
      {!hidePagination && total > pageSize && (
        <Pagination
          currentPageNumber={currentPage}
          pageSize={pageSize}
          total={total}
          onPageOrTabChange={onPageChange}
        />
      )}
    </div>
  );
};
