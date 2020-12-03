import React from 'react';
import styles from '../styles/InterruptionCard.module.scss';

const InterruptionCard = (props: Props) => (
  <div className={styles.card}>
    <div className={styles.inner}>{props.children}</div>
    {props.image && <img src={props.image} alt="" />}
  </div>
);

interface Props {
  children: React.ReactNode;
  image?: string;
}

export default InterruptionCard;
