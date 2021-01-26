import React, { FunctionComponent } from 'react';
import Dialog from './Dialog';
import { Button } from 'lbh-frontend-react';
import styles from '../styles/Dialog.module.scss';
import { EvidenceRequestRequest } from 'src/gateways/internal-api';
import { DocumentType } from 'src/domain/document-type';

const ConfirmRequestDialog: FunctionComponent<Props> = ({
  onDismiss,
  onAccept,
  request,
  documentTypes,
}) => (
  <Dialog
    open={request !== undefined}
    onDismiss={onDismiss}
    title="Are you sure you want to send this request?"
  >
    <p className="lbh-body">You're about to send a request to:</p>
    <ul className="lbh-list lbh-list--bullet">
      <li>
        Name: <strong>{request?.resident.name}</strong>
      </li>
      <li>
        Email: <strong>{request?.resident.email}</strong>
      </li>
      <li>
        Phone Number: <strong>{request?.resident.phoneNumber}</strong>
      </li>
    </ul>

    <p className="lbh-body">for the following evidence:</p>
    <ul className="lbh-list lbh-list--bullet">
      {request?.documentTypes.map((id) => (
        <li>
          <strong>{documentTypes.find((dt) => dt.id == id)?.title}</strong>
        </li>
      ))}
    </ul>

    <div className={styles.actions}>
      <Button onClick={onAccept}>Yes, send this request</Button>
      <button
        onClick={onDismiss}
        type="button"
        className={`${styles.cancelButton} lbh-body lbh-link`}
      >
        No, cancel
      </button>
    </div>
  </Dialog>
);

interface Props {
  request?: EvidenceRequestRequest;
  documentTypes: DocumentType[];
  onAccept(): void;
  onDismiss(): void;
}

export default ConfirmRequestDialog;
