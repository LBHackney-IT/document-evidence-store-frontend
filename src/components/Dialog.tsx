import React, { FunctionComponent } from 'react';
import { Heading, HeadingLevels } from 'lbh-frontend-react';
import { Dialog as ReachDialog } from '@reach/dialog';
import '@reach/dialog/styles.css';
import styles from '../styles/Dialog.module.scss';

const Dialog: FunctionComponent<Props> = (props) => (
  <ReachDialog
    isOpen={props.open}
    aria-label={props.title}
    onDismiss={props.onDismiss}
    className={styles.dialog}
  >
    <Heading level={HeadingLevels.H2}>{props.title}</Heading>
    {props.children}
  </ReachDialog>
);

interface Props {
  open: boolean;
  title: string;
  onDismiss(): void;
}

export default Dialog;
