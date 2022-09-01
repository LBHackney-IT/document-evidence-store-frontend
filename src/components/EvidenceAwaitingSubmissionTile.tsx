import React, { FunctionComponent } from 'react';
import styles from '../styles/EvidenceTile.module.scss';

export const EvidenceAwaitingSubmissionTile: FunctionComponent<Props> = (
  props
) => (
  <li className={styles.item}>
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
);

interface Props {
  id: string;
  documentType: string;
  dateRequested: string;
  requestedBy: string | undefined;
}
