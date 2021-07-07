import React, { FunctionComponent, useCallback, useState } from 'react';
import Dialog from './Dialog';
import styles from '../styles/Dialog.module.scss';
import Radio from './Radio';
import { Form, Formik } from 'formik';
import { DocumentType } from '../domain/document-type';
import * as Yup from 'yup';
import {
  DocumentSubmissionUpdateForm,
  InternalApiGateway,
} from '../gateways/internal-api';
import { DocumentState } from '../domain/document-submission';
import DateFields from './DateFields';
import router from 'next/router';

const schema = Yup.object().shape({
  staffSelectedDocumentTypeId: Yup.string().required(
    'Please choose a document type'
  ),
});

const initialValues = {
  state: DocumentState.APPROVED,
  staffSelectedDocumentTypeId: '',
  validUntilDates: [],
};

const AcceptDialog: FunctionComponent<Props> = (props) => {
  const [submitError, setSubmitError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const handleAccept = useCallback(
    async (values: DocumentSubmissionUpdateForm) => {
      try {
        const gateway = new InternalApiGateway();
        const payload = buildAcceptDocumentSubmissionRequest(
          values,
          props.email
        );
        await gateway.updateDocumentSubmission(
          props.email,
          props.documentSubmissionId,
          payload
        );
        router.push(props.redirect, undefined, { shallow: true });
      } catch (err) {
        console.error(err);
        setSubmitError(true);
        setErrorMessage(err);
      }
    },
    [setErrorMessage, setSubmitError]
  );

  const buildAcceptDocumentSubmissionRequest = (
    values: DocumentSubmissionUpdateForm,
    userUpdatedBy: string
  ) => {
    if (values.validUntilDates && values.validUntilDates.length > 0) {
      return {
        state: values.state,
        userUpdatedBy: userUpdatedBy,
        staffSelectedDocumentTypeId: values.staffSelectedDocumentTypeId,
        validUntil: values.validUntilDates.join('-'),
      };
    } else {
      return {
        state: values.state,
        userUpdatedBy: userUpdatedBy,
        staffSelectedDocumentTypeId: values.staffSelectedDocumentTypeId,
      };
    }
  };
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
        onSubmit={handleAccept}
        validateOnBlur={false}
        validateOnChange={true}
      >
        {({ errors, touched, isSubmitting }) => (
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
            </div>

            <div
              className={`govuk-form-group lbh-form-group ${
                touched.validUntilDates &&
                errors.validUntilDates &&
                'govuk-form-group--error'
              }`}
            >
              <fieldset className="govuk-fieldset">
                <legend className="govuk-fieldset__legend">
                  When does this document expire?
                </legend>
                {submitError && (
                  <span className="govuk-error-message lbh-error-message">
                    {errorMessage}
                  </span>
                )}
                <DateFields name="validUntilDates" />
              </fieldset>
            </div>

            <div className={styles.actions}>
              <button
                onClick={() => {
                  props.onDismiss;
                }}
                className="govuk-button lbh-button"
                type="submit"
                disabled={isSubmitting}
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
  onDismiss(): void;
  email: string;
  documentSubmissionId: string;
  redirect: string;
}

export default AcceptDialog;
