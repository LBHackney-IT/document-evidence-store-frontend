import React, { FunctionComponent } from 'react';
import styles from '../styles/Panel.module.scss';

const Panel: FunctionComponent<Props> = (props: Props) => (
  <div className={styles.panel}>{props.children}</div>
);

interface Props {
  children: React.ReactNode;
}

export default Panel;
