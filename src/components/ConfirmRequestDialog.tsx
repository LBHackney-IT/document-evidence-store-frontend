import React, { FunctionComponent, useState } from 'react';
import Dialog from './Dialog';
import { Button } from 'lbh-frontend-react';
import styles from '../styles/Dialog.module.scss';
import { EvidenceRequestRequest } from 'src/gateways/internal-api';
import { DocumentType } from 'src/domain/document-type';

const humanisedMethods: Record<string, string> = {
  EMAIL: 'email',
  SMS: 'SMS',
};
const formatSentence = (deliveryMethods: string[], reason: string) => {
  if (!deliveryMethods.length)
    return `You're about to make a ${reason} request to`;

  const methods = deliveryMethods
    .map((dm) => humanisedMethods[dm])
    .join(' and ');
  return `You're about to send a ${reason} request by ${methods} to:`;
};

const ConfirmRequestDialog: FunctionComponent<Props> = ({
  onDismiss,
  onAccept,
  request,
  documentTypes,
}) => {
  const [loading, setLoading] = useState(false);
  if (!request) return null;
  return (
    <Dialog
      open={request !== undefined}
      onDismiss={onDismiss}
      title="Are you sure you want to send this request?"
    >
      <p className="lbh-body">
        {formatSentence(request.deliveryMethods, request.reason)}
      </p>
      <ul className="lbh-list lbh-list--bullet">
        <li>
          <strong>{request.resident.name}</strong>
        </li>
        <li>
          <strong>{request.resident.email}</strong>
        </li>
        <li>
          <strong>{request.resident.phoneNumber}</strong>
        </li>
      </ul>

      <p className="lbh-body">for the following evidence:</p>
      <ul className="lbh-list lbh-list--bullet">
        {request.documentTypes.map((id) => (
          <li key={id}>
            <strong>
              {documentTypes.find((dt) => dt.id == id)?.title.toLowerCase()}
            </strong>
          </li>
        ))}
      </ul>

      <div className={styles.actions}>
        <Button
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            try {
              await onAccept();
            } catch (err) {
              console.error(err);
            }
            setLoading(false);
          }}
        >
          Yes, send this request
        </Button>
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
};

interface Props {
  request?: EvidenceRequestRequest;
  documentTypes: DocumentType[];
  onAccept(): Promise<void>;
  onDismiss(): void;
}

export default ConfirmRequestDialog;
