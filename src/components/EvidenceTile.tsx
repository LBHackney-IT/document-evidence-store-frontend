import React, { FunctionComponent, ReactNode } from 'react';
import Link from 'next/link';
import styles from '../styles/EvidenceTile.module.scss';
import { humanFileSize } from '../helpers/formatters';
import { DocumentState } from '../domain/document-submission';

export const EvidenceTile: FunctionComponent<Props> = ({
  teamId,
  residentId,
  id,
  format,
  fileSizeInBytes,
  title,
  createdAt,
  state,
  reason,
  requestedBy,
  userUpdatedBy,
}) => {
  enum tagColour {
    UPLOADED = 'lbh-tag lbh-tag--blue',
    APPROVED = 'lbh-tag lbh-tag--green',
    REJECTED = 'lbh-tag lbh-tag--red',
  }
  return (
    <table>
      <tbody>
        <tr className="govuk-table__row">
          <td>
            <li>
              <div className="govuk-summary-list lbh-summary-list">
                <h3 className={`${styles.title} lbh-heading-h3`}>
                  <Link
                    href={`/teams/${teamId}/dashboard/residents/${residentId}/document/${id}`}
                  >
                    <a className="lbh-link">{title}</a>
                  </Link>
                  <p
                    className={`lbh-body-s ${styles.title}`}
                    style={{ display: 'inline', marginLeft: '8px' }}
                  >
                    {`(${format?.toUpperCase()} ${humanFileSize(
                      fileSizeInBytes
                    )})`}
                  </p>
                </h3>
                <p className={`lbh-body-s ${styles.meta}`}>
                  Date uploaded: {createdAt}
                </p>
                <p className={`lbh-body-s ${styles.meta}`}>{reason}</p>
                <p className={`lbh-body-s ${styles.meta}`}>
                  Requested by {requestedBy}
                </p>
                {state === 'APPROVED' && (
                  <p className={`lbh-body-s ${styles.meta}`}>
                    Approved by {userUpdatedBy}
                  </p>
                )}
              </div>
            </li>
          </td>
          <td></td>
          <td>
            <span
              className={'govuk-tag ' + tagColour[state]}
              style={{ whiteSpace: 'nowrap', marginRight: '80px' }}
            >
              {state === 'UPLOADED' ? 'PENDING REVIEW' : state}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
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
  teamId: string;
  residentId: string;
  id: string;
  format: string | undefined;
  fileSizeInBytes: number;
  title: string;
  createdAt: string;
  state: DocumentState;
  reason: string | undefined;
  requestedBy: string | undefined;
  userUpdatedBy: string | null;
}
