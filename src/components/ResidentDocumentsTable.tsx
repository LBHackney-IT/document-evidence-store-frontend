import React, { FunctionComponent, useMemo, useState } from 'react';
import { EvidenceList, EvidenceTile } from './EvidenceTile';
import { formatDate } from '../helpers/formatters';
import { Pagination } from 'src/components/Pagination';
import { EvidenceAwaitingSubmissionTile } from './EvidenceAwaitingSubmissionTile';
import { EvidenceRequest } from '../domain/evidence-request';
import { DateTime } from 'luxon';
import {
  DocumentSubmission,
  IDocumentSubmission,
} from '../domain/document-submission';
import styles from '../styles/EvidenceTile.module.scss';

interface Props {
  evidenceRequests: EvidenceRequest[];
  awaitingSubmissions: EvidenceAwaitingSubmission[];
  documentSubmissions: DocumentSubmission[];
  hidePaginationFunction: (hidePaginate: boolean) => void;
  total: number;
  pageSize: number;
  onPageOrTabChange: (page: number, state?: string) => Promise<void>;
}

export type EvidenceAwaitingSubmission = {
  documentType: string;
  dateRequested: DateTime | undefined;
  requestedBy: string | undefined;
  reason: string | undefined;
  kind: 'EvidenceAwaitingSubmission';
};

type DocumentSubmissionWithKind = IDocumentSubmission & {
  kind: 'DocumentSubmissionWithKind';
};

type DocumentTabItem = DocumentSubmissionWithKind | EvidenceAwaitingSubmission;

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
  hidePaginationFunction,
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

  // const evidenceAwaitingSubmissions = useMemo(() => {
  //   const documentTypesMap = new Map<string, Set<DocumentType>>();
  //   evidenceRequests.forEach((er) =>
  //     documentTypesMap.set(er.id, new Set(er.documentTypes))
  //   );
  //   documentSubmissions.forEach((ds) => {
  //     if (!ds.evidenceRequestId) {
  //       return;
  //     }
  //     const currentDocumentTypesSet = documentTypesMap.get(
  //       ds.evidenceRequestId
  //     );

  //     currentDocumentTypesSet?.forEach((dt) => {
  //       if (dt.id === ds.documentType.id) {
  //         currentDocumentTypesSet.delete(dt);
  //       }
  //     });
  //   });

  //   const awaitingSubmissions: EvidenceAwaitingSubmission[] = [];
  //   documentTypesMap.forEach((value, key) => {
  //     value.forEach((dt) => {
  //       const evidenceRequestFromKey = evidenceRequests.find(
  //         (er) => er.id == key
  //       );
  //       awaitingSubmissions.push({
  //         documentType: dt.title,
  //         dateRequested: evidenceRequestFromKey?.createdAt,
  //         requestedBy: evidenceRequestFromKey?.userRequestedBy,
  //         reason: evidenceRequestFromKey?.reason,
  //         kind: 'EvidenceAwaitingSubmission',
  //       });
  //     });
  //   });
  //   return awaitingSubmissions;
  // }, [evidenceRequests, documentSubmissions]);

  const documentTabItems = documentSubmissions.map<DocumentSubmissionWithKind>(
    (x) => ({
      ...x,
      kind: 'DocumentSubmissionWithKind',
    })
  );

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

  const [currentPage, setCurrentPage] = useState(1);
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
                  {documentTab.id === 'awaiting-submission' ? (
                    awaitingSubmissions.map((x, i) => (
                      <li
                        className={styles.item}
                        data-testid={`${documentTab.id}-evidence-awaiting-tile`}
                        key={i}
                      >
                        <EvidenceAwaitingSubmissionTile
                          documentType={x.documentType}
                          dateRequested={x.dateRequested}
                          requestedBy={x.requestedBy}
                          reason={x.reason}
                        />
                      </li>
                    ))
                  ) : documentTabItems && documentTabItems.length > 0 ? (
                    documentTabItems.map((documentTabItem, index) => (
                      <>
                        <li
                          className={styles.item}
                          data-testid={`${documentTab.id}-evidence-tile`}
                          key={index}
                        >
                          <EvidenceTile
                            id={documentTabItem.id}
                            title={
                              documentTabItem.staffSelectedDocumentType
                                ?.title || documentTabItem.documentType.title
                            }
                            createdAt={formatDate(documentTabItem.createdAt)}
                            key={documentTabItem.id}
                            fileSizeInBytes={
                              documentTabItem.document
                                ? documentTabItem.document.fileSizeInBytes
                                : 0
                            }
                            format={
                              documentTabItem.document
                                ? documentTabItem.document.extension
                                : 'unknown'
                            }
                            state={documentTabItem.state}
                            reason={
                              documentTabItem.evidenceRequestId &&
                              getReason(documentTabItem.evidenceRequestId)
                            }
                            requestedBy={
                              documentTabItem.evidenceRequestId &&
                              getUserRequestedBy(
                                documentTabItem.evidenceRequestId
                              )
                            }
                            userUpdatedBy={documentTabItem.userUpdatedBy}
                          />
                        </li>
                      </>
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
