import React, { FunctionComponent } from 'react';
import Dialog from './Dialog';
import styles from '../styles/Dialog.module.scss';
import Radio from './Radio';
import { Form, Formik } from 'formik';
import { DocumentType } from '../domain/document-type';
import * as Yup from 'yup';
import { DocumentSubmissionForm } from '../gateways/internal-api';
import { DocumentState } from '../domain/document-submission';
import DateForm from './DateForm';

const schema = Yup.object().shape({
  staffSelectedDocumentTypeId: Yup.string().required(
    'Please choose a document type'
  ),
});

const initialValues = {
  state: DocumentState.APPROVED,
  staffSelectedDocumentTypeId: '',
  validUntilArray: [],
};

const AcceptDialog: FunctionComponent<Props> = (props) => {
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

      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={props.onAccept}
      >
        {({ errors, touched }) => (
          <Form>
            <div
              className={`govuk-form-group lbh-form-group ${
                touched.staffSelectedDocumentTypeId &&
                errors.staffSelectedDocumentTypeId &&
                'govuk-form-group--error'
              }`}
            >
              <fieldset className="govuk-fieldset">
                <legend className="govuk-fieldset__legend">
                  What kind of document is this?
                </legend>
                {touched.staffSelectedDocumentTypeId &&
                  errors.staffSelectedDocumentTypeId && (
                    <span className="govuk-error-message lbh-error-message">
                      <span className="govuk-visually-hidden">Error:</span>{' '}
                      {errors.staffSelectedDocumentTypeId}
                    </span>
                  )}
                <div className="govuk-radios lbh-radios">
                  {props.staffSelectedDocumentTypes.map((documentType) => (
                    <Radio
                      label={documentType.title}
                      key={documentType.id}
                      value={documentType.id}
                      name="staffSelectedDocumentTypeId"
                    />
                  ))}
                </div>
              </fieldset>

              <fieldset className="govuk-fieldset" role="group">
                <legend className="govuk-fieldset__legend">
                  When does this document expire?
                </legend>
                <DateForm />
              </fieldset>
            </div>

            <div className={styles.actions}>
              <button
                onClick={props.onDismiss}
                className="govuk-button lbh-button"
                type="submit"
              >
                Yes, accept
              </button>
              <button
                onClick={props.onDismiss}
                className={`${styles.cancelButton} lbh-body lbh-link`}
                type="button"
              >
                No, cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

interface Props {
  open: boolean;
  staffSelectedDocumentTypes: Array<DocumentType>;
  onAccept: (values: DocumentSubmissionForm) => Promise<void>;
  onDismiss(): void;
}

export default AcceptDialog;
