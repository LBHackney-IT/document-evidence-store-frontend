import React, { FunctionComponent, useState } from 'react';
import Dialog from './Dialog';
import styles from '../styles/Dialog.module.scss';
import { EvidenceRequestRequest } from 'src/gateways/internal-api';
import { DocumentType } from 'src/domain/document-type';

const humanisedMethods: Record<string, string> = {
  EMAIL: 'email',
  SMS: 'SMS',
};
const formatSentence = (deliveryMethods: string[]) => {
  if (!deliveryMethods.length) return "You're about to make a request to:";

  const methods = deliveryMethods
    .map((dm) => humanisedMethods[dm])
    .join(' and ');
  return `You're about to send a request by ${methods} to:`;
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
        Request reason: <strong>{request.reason}</strong>
      </p>
      <p className="lbh-body">{formatSentence(request.deliveryMethods)}</p>

      <ul className="lbh-list">
        <li>
          <strong>{request.resident.name}</strong>
        </li>
        <li>{request.resident.email}</li>
        <li>{request.resident.phoneNumber}</li>
      </ul>

      <p className="lbh-body">for the following evidence:</p>
      <ul className="lbh-list lbh-list--bullet">
        {request.documentTypes.map((id) => (
          <li key={id}>
            {documentTypes.find((dt) => dt.id == id)?.title.toLowerCase()}
          </li>
        ))}
      </ul>

      <div className={styles.actions}>
        <button
          className="govuk-button lbh-button"
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
        </button>
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
