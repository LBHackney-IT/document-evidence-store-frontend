import React, { FunctionComponent, ReactNode, useContext } from 'react';
import Link from 'next/link';
import styles from '../styles/EvidenceTile.module.scss';
import { humanFileSize } from '../helpers/formatters';
import { DocumentState } from '../domain/document-submission';
import { ResidentPageContext } from '../contexts/ResidentPageContext';

export const EvidenceTile: FunctionComponent<Props> = ({
  id,
  format,
  fileSizeInBytes,
  title,
  createdAt,
  state,
  reason,
  requestedBy,
  userUpdatedBy,
  documentDescription,
  onDeleteClick,
  isSuperUser,
}) => {
  enum tagColour {
    UPLOADED = 'lbh-tag lbh-tag--blue',
    APPROVED = 'lbh-tag lbh-tag--green',
    REJECTED = 'lbh-tag lbh-tag--red',
  }
  const residentPageContext = useContext(ResidentPageContext);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        width: '100%',
      }}
    >
      <div style={{ flex: 1 }}>
        <div className="govuk-summary-list lbh-summary-list">
          <h3 className={`${styles.title} lbh-heading-h3`}>
            <Link
              href={`/teams/${residentPageContext?.teamIdContext}/dashboard/residents/${residentPageContext?.residentIdContext}/document/${id}`}
            >
              <a className="lbh-link">{title}</a>
            </Link>
            {format && (
              <p
                className={`lbh-body-s ${styles.title}`}
                style={{ display: 'inline', marginLeft: '8px' }}
                data-testid="format"
              >
                {`(${format?.toUpperCase()} ${humanFileSize(fileSizeInBytes)})`}
              </p>
            )}
          </h3>
          <p className={`lbh-body-s ${styles.meta}`}>
            Date uploaded: {createdAt}
          </p>
          {documentDescription && (
            <p className={`lbh-body-s ${styles.meta}`}>
              Description: {documentDescription}
            </p>
          )}
          {reason && <p className={`lbh-body-s ${styles.meta}`}>{reason}</p>}
          {requestedBy && (
            <p className={`lbh-body-s ${styles.meta}`}>
              Requested by {requestedBy}
            </p>
          )}
          {state === 'APPROVED' && (
            <p className={`lbh-body-s ${styles.meta}`}>
              Approved by {userUpdatedBy}
            </p>
          )}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          flexShrink: 0,
        }}
      >
        <span className={`govuk-tag ${tagColour[state]} ${styles.tag}`}>
          {state === 'UPLOADED' ? 'PENDING REVIEW' : state}
        </span>
        {isSuperUser && (
          <button
            className="govuk-tag"
            onClick={onDeleteClick}
            data-testid={`delete-button-${id}`}
            style={{
              backgroundColor: 'white',
              borderColor: '#be3a34',
              color: '#be3a34',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              marginRight: 0,
              marginTop: 0,
              marginBottom: 0,
              padding: '5px 8px',
              lineHeight: '1',
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export const EvidenceList: FunctionComponent<ListProps> = (props) => (
  <ul className={props.twoColumns ? styles.twoColumnList : styles.list}>
    {props.children}
  </ul>
);

interface ListProps {
  children: ReactNode;
  twoColumns?: boolean;
}

interface Props {
  id: string;
  format: string | undefined;
  fileSizeInBytes: number;
  createdAt: string;
  state: DocumentState;
  reason: string | undefined;
  requestedBy: string | undefined;
  userUpdatedBy: string | null;
  documentDescription?: string | undefined;
  title?: string;
  onDeleteClick: () => void;
  isSuperUser: boolean;
}
