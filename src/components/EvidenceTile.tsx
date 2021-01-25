import React, { FunctionComponent, ReactNode } from 'react';
import Link from 'next/link';
import styles from '../styles/EvidenceTile.module.scss';
import { Heading, HeadingLevels } from 'lbh-frontend-react';
import { humanFileSize } from '../helpers/formatters';

export const EvidenceTile: FunctionComponent<Props> = (props) => (
  <li className={styles.item}>
    <div className={styles.preview}>
      <strong>{props.format}</strong>
      <span className={styles.filesize}>{humanFileSize(props.fileSize)}</span>
    </div>
    <div>
      <Heading level={HeadingLevels.H3} className={styles.title}>
        <Link
          href={`/dashboard/resident/${props.residentId}/document/${props.id}`}
        >
          <a className="lbh-link">{props.title}</a>
        </Link>
      </Heading>
      <p className={`lbh-body-s ${styles.meta}`}>
        {props.createdAt}
        {props.purpose && <> with {props.purpose}</>}
      </p>
    </div>

    {props.toReview && (
      <div className={`lbh-body-s ${styles.actions}`}>
        <Link
          href={`/dashboard/resident/${props.residentId}/document/${props.id}?action=accept`}
          scroll={false}
        >
          <a className="lbh-link">Accept</a>
        </Link>
        <Link
          href={`/dashboard/resident/${props.residentId}/document/${props.id}?action=reject`}
          scroll={false}
        >
          <a className={`lbh-link ${styles.redLink}`}>Request new file</a>
        </Link>
      </div>
    )}
  </li>
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
  residentId: string;
  id: string;
  format: string;
  fileSize: number;
  title: string;
  createdAt: string;
  purpose?: string;
  toReview?: boolean;
}
