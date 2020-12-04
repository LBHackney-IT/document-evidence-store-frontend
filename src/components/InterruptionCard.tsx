import React, { FunctionComponent } from 'react';
import styles from '../styles/InterruptionCard.module.scss';

const InterruptionCard: FunctionComponent<Props> = (props) => (
  <div className={styles.card}>
    <div className={styles.inner}>{props.children}</div>
    {props.image && <img src={props.image} alt="" />}
  </div>
);

interface Props {
  image?: string;
}

export default InterruptionCard;
