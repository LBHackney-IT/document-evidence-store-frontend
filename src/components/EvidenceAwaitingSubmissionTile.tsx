import React, { FunctionComponent } from 'react';
import styles from '../styles/EvidenceTile.module.scss';

export const EvidenceAwaitingSubmissionTile: FunctionComponent<Props> = (
  props
) => (
  <table className={styles.item}>
    <tr className="govuk-table__row">
      <td>
        <li className="govuk-summary-list lbh-summary-list">
          <div>
            <h3 className={`${styles.title} lbh-heading-h3`}>
              <a className="lbh-link" style={{ pointerEvents: 'none' }}>
                {props.documentType}
              </a>
            </h3>
            <p className={`lbh-body-s ${styles.meta}`}>
              Date requested: {props.dateRequested}
            </p>
            <p className={`lbh-body-s ${styles.meta}`}>
              Requested by: {props.requestedBy}
            </p>
          </div>
        </li>
      </td>
      <td style={{ width: 180 }}>
        <span
          className="govuk-tag lbh-tag lbh-tag--yellow"
          style={{ padding: '0px' }}
        >
          AWAITING SUBMISSION
        </span>
      </td>
    </tr>
  </table>
);

interface Props {
  id: string;
  documentType: string;
  dateRequested: string;
  requestedBy: string | undefined;
}
