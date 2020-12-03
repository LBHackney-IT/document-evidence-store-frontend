import React from 'react';
import Alert from '@reach/alert';
import styles from '../styles/Alert.module.scss';

const AlertBanner = (props: Props) => (
  <Alert className={styles.alert}>{props.children}</Alert>
);

interface Props {
  children: React.ReactNode;
}

export default AlertBanner;
