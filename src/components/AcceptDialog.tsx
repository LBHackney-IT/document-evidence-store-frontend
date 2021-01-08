import React, { FunctionComponent } from 'react';
import Dialog from './Dialog';
import { Button } from 'lbh-frontend-react';
import styles from '../styles/Dialog.module.scss';

const AcceptDialog: FunctionComponent<Props> = (props) => (
  <Dialog
    open={props.open}
    onDismiss={props.onDismiss}
    title="Are you sure you want to accept this file?"
  >
    <p className="lbh-body">Files are acceptable if:</p>
    <ul className="lbh-list lbh-list--bullet">
      <li>it’s an image or scan of the correct document</li>
      <li>any images are good quality and well lit</li>
      <li>any text is clearly legible</li>
    </ul>

    <div className={styles.actions}>
      <Button onClick={props.onAccept}>Yes, accept</Button>
      <a href="#" className="lbh-body lbh-link" onClick={props.onDismiss}>
        No, cancel
      </a>
    </div>
  </Dialog>
);

interface Props {
  open: boolean;
  onAccept(): void;
  onDismiss(): void;
}

export default AcceptDialog;
