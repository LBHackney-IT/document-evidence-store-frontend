import React, { FunctionComponent } from 'react';
import styles from '../styles/EvidenceTile.module.scss';
import { formatDate } from '../helpers/formatters';
import { DateTime } from 'luxon';

export const EvidenceAwaitingSubmissionTile: FunctionComponent<Props> = (
  props
) => (
  <table>
    <tbody>
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
                Date requested: {formatDate(props.dateRequested)}
              </p>
              <p className={`lbh-body-s ${styles.meta}`}>{props.reason}</p>
              <p className={`lbh-body-s ${styles.meta}`}>
                Requested by: {props.requestedBy}
              </p>
            </div>
          </li>
        </td>
        <td>
          <span
            className="govuk-tag lbh-tag lbh-tag--yellow"
            style={{ whiteSpace: 'nowrap', marginRight: '80px' }}
          >
            AWAITING SUBMISSION
          </span>
        </td>
      </tr>
    </tbody>
  </table>
);

interface Props {
  id: number;
  documentType: string;
  dateRequested: DateTime | undefined;
  requestedBy: string | undefined;
  reason: string | undefined;
}
