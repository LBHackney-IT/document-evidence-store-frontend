import React, { FunctionComponent } from 'react';
import Alert from '@reach/alert';
import styles from '../styles/Alert.module.scss';

const AlertBanner: FunctionComponent = (props) => (
  <Alert className={styles.alert}>{props.children}</Alert>
);

export default AlertBanner;
