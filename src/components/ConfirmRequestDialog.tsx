import React, { FunctionComponent, useState } from 'react';
import Dialog from './Dialog';
import dialogStyles from '../styles/Dialog.module.scss';
import insetTextStyles from '../styles/InsetText.module.scss';
import { EvidenceRequestForm } from 'src/gateways/internal-api';
import { DocumentType } from 'src/domain/document-type';
import { useFormikContext } from 'formik';
import SVGNoteToResident from './SVGNoteToResident';
import { sanitiseNoteToResident } from 'src/helpers/sanitisers';

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
  deliveryMethods,
  documentTypes,
}) => {
  const [loading, setLoading] = useState(false);
  const { values } = useFormikContext<EvidenceRequestForm>();
  if (!values) return null;
  return (
    <Dialog
      open={values !== undefined}
      onDismiss={onDismiss}
      title="Are you sure you want to send this request?"
    >
      <p className="lbh-body">
        What is this request for:
        <br />
        <strong>{values.reason}</strong>
      </p>

      <p className="lbh-body">{formatSentence(deliveryMethods)}</p>
      <ul className="lbh-list govuk-!-margin-top-2">
        <li>
          <strong>{values.resident.name}</strong>
        </li>
        <li>
          <strong>{values.resident.email}</strong>
        </li>
        <li>
          <strong>{values.resident.phoneNumber}</strong>
        </li>
      </ul>

      <p className="lbh-body">For the following evidences:</p>
      <ul className="lbh-list lbh-list--bullet govuk-!-margin-top-2">
        <strong>
          {values.documentTypes.map((id) => (
            <li key={id}>{documentTypes.find((dt) => dt.id == id)?.title}</li>
          ))}
        </strong>
      </ul>

      {sanitiseNoteToResident(values.noteToResident) && (
        <div
          className={`govuk-inset-text lbh-inset-text
           ${insetTextStyles.insetText}`}
        >
          <SVGNoteToResident />
          <strong>Bespoke note to resident</strong>
          <p>{sanitiseNoteToResident(values.noteToResident)}</p>
        </div>
      )}

      <div className={dialogStyles.actions}>
        <button
          className="govuk-button lbh-button"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            try {
              await onAccept(values);
            } catch (err) {
              console.error(err);
            }
          }}
        >
          Confirm
        </button>
        <button
          onClick={onDismiss}
          type="button"
          className={`${dialogStyles.cancelButton} lbh-body lbh-link`}
        >
          No, cancel
        </button>
      </div>
    </Dialog>
  );
};

interface Props {
  deliveryMethods: string[];
  documentTypes: DocumentType[];
  onAccept: (values: EvidenceRequestForm) => Promise<void>;
  onDismiss(): void;
}

export default ConfirmRequestDialog;
