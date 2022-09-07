import React, { FunctionComponent, ReactNode } from 'react';
import Link from 'next/link';
import styles from '../styles/EvidenceTile.module.scss';
import { humanFileSize } from '../helpers/formatters';
import { DocumentState } from '../domain/document-submission';

export const EvidenceTile: FunctionComponent<Props> = (props) => {
  const documentState = props.state;
  const states = ['UPLOADED', 'APPROVED', 'REJECTED'];

  const giveTagColor = (documentState: string) => {
    {
      if (documentState === 'UPLOADED') return 'lbh-tag lbh-tag--blue';
      else if (documentState === 'APPROVED') return 'lbh-tag lbh-tag--green';
      else if (documentState === 'REJECTED') return 'lbh-tag lbh-tag--red';
    }
  };
  return (
    <table className={styles.item}>
      <tr className="govuk-table__row">
        <td>
          <li>
            <div className="govuk-summary-list lbh-summary-list">
              <h3 className={`${styles.title} lbh-heading-h3`}>
                <Link
                  href={`/teams/${props.teamId}/dashboard/residents/${props.residentId}/document/${props.id}`}
                >
                  <a className="lbh-link">{props.title}</a>
                </Link>
                <p
                  className={`lbh-body-s ${styles.title}`}
                  style={{ display: 'inline', marginLeft: '8px' }}
                >
                  {`(${props.format?.toUpperCase()} ${humanFileSize(
                    props.fileSizeInBytes
                  )})`}
                </p>
              </h3>
              <p className={`lbh-body-s ${styles.meta}`}>
                Date Created : {props.createdAt}
              </p>
              <p className={`lbh-body-s ${styles.meta}`}>{props.reason}</p>
              <p className={`lbh-body-s ${styles.meta}`}>
                Requested by {props.requestedBy}
              </p>
            </div>
          </li>
        </td>
        <td></td>
        <td style={{ width: 180 }}>
          <span
            className={'govuk-tag ' + giveTagColor(documentState)}
            style={{ display: 'inline-flex' }}
          >
            {documentState === 'UPLOADED'
              ? 'PENDING REVIEW'
              : states.includes(documentState)
              ? documentState
              : 'AWAITING SUBMISSION'}
          </span>
        </td>
      </tr>
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
  purpose?: string;
  toReview?: boolean;
  state: DocumentState;
  reason: string | undefined;
  requestedBy: string | undefined;
}
