import React, { FunctionComponent, useState } from 'react';
import Dialog from './Dialog';
import styles from '../styles/Dialog.module.scss';

const AcceptDialog: FunctionComponent<Props> = (props) => {
  const [loading, setLoading] = useState(false);

  return (
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
        <button
          className="govuk-button lbh-button"
          onClick={async () => {
            setLoading(true);
            try {
              await props.onAccept();
            } catch (err) {
              console.error(err);
            }
            setLoading(false);
          }}
          disabled={loading}
        >
          Yes, accept
        </button>
        <button
          onClick={props.onDismiss}
          type="button"
          className={`${styles.cancelButton} lbh-body lbh-link`}
          disabled={loading}
        >
          No, cancel
        </button>
      </div>
    </Dialog>
  );
};

interface Props {
  open: boolean;
  onAccept(): Promise<void>;
  onDismiss(): void;
}

export default AcceptDialog;
