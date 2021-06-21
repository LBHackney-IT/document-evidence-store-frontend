import React, { FunctionComponent } from 'react';
import Dialog from './Dialog';
import { Formik, Form } from 'formik';
import Field from './Field';
import * as Yup from 'yup';
import styles from '../styles/Dialog.module.scss';
import { DocumentState } from '../domain/document-submission';
import { DocumentSubmissionUpdateForm } from '../gateways/internal-api';

const schema = Yup.object().shape({
  rejectionReason: Yup.string()
    .required('Please give a reason')
    .min(2, 'Reason needs to be at least three characters'),
});

const initialValues = {
  state: DocumentState.REJECTED,
  rejectionReason: '',
};

const RejectDialog: FunctionComponent<Props> = (props) => {
  return (
    <Dialog
      open={props.open}
      onDismiss={props.onDismiss}
      title="Request a new file"
    >
      <Formik
        onSubmit={props.onReject}
        validationSchema={schema}
        initialValues={initialValues}
        validateOnBlur={false}
        validateOnChange={true}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Field
              label="Reason for rejection"
              hint="For example, text not legible"
              name="rejectionReason"
              textarea
              error={touched.rejectionReason ? errors.rejectionReason : null}
            />
            <div className={styles.actions}>
              <button
                className="govuk-button lbh-button"
                type="submit"
                disabled={isSubmitting}
              >
                Request new file
              </button>
              <button
                onClick={props.onDismiss}
                className={`lbh-body lbh-link ${styles.cancelButton}`}
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
  onReject: (values: DocumentSubmissionUpdateForm) => Promise<void>;
  onDismiss(): void;
}

export default RejectDialog;
