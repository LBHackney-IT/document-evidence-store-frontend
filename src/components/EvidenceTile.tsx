import React, { FunctionComponent, ReactNode } from 'react';
import Link from 'next/link';
import styles from '../styles/EvidenceTile.module.scss';
import { humanFileSize } from '../helpers/formatters';
import { DocumentState } from '../domain/document-submission';

export const EvidenceTile: FunctionComponent<Props> = (props) => (
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
              {props.createdAt}
              {/* {props.purpose && <> with {props.purpose}</>} */}
            </p>
          </div>
        </li>
      </td>
      <td></td>
      <td style={{ width: 150 }}>
        {' '}
        {props.state.charAt(0).toUpperCase() +
          props.state.toLowerCase().slice(1)}
      </td>
    </tr>
  </table>
);

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
}
