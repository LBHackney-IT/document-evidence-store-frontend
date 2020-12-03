import React from 'react';
import styles from '../styles/Panel.module.scss';

const Panel = (props: Props) => (
  <div className={styles.panel}>{props.children}</div>
);

interface Props {
  children: React.ReactNode;
}

export default Panel;
