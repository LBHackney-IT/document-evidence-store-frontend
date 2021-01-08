import React, { FunctionComponent } from 'react';
import Dialog from './Dialog';
import { Button } from 'lbh-frontend-react';
import { Formik, Form } from 'formik';
import Field from './Field';
import * as Yup from 'yup';
import styles from '../styles/Dialog.module.scss';

const schema = Yup.object().shape({
  reason: Yup.string()
    .required('Please give a reason')
    .min(2, 'Reason needs to be at least three characters'),
});

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
        initialValues={{
          reason: '',
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Field
              label="Reason for rejection"
              hint="For example, text not legible"
              name="reason"
              textarea
              error={touched.reason ? errors.reason : null}
            />
            <div className={styles.actions}>
              <Button onClick={props.onReject} disabled={isSubmitting}>
                Request new file
              </Button>
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
  onReject(): void;
  onDismiss(): void;
}

export default RejectDialog;
