import React, {
  FunctionComponent,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { Button, ErrorMessage } from 'lbh-frontend-react';
import { Formik, Form, FormikTouched, FormikErrors } from 'formik';
import UploaderPanel from './UploaderPanel';
import { DocumentSubmission } from '../domain/document-submission';
import { UploadFormModel } from '../services/upload-form-model';

const getError = (
  id: string,
  touched: FormikTouched<File>,
  errors: FormikErrors<File>
) => {
  const dirty = touched[id as keyof typeof touched];
  if (!dirty) return null;
  return errors[id as keyof typeof errors] as string;
};

const UploaderForm: FunctionComponent<Props> = ({
  submissions,
  onSuccess,
  evidenceRequestId,
}) => {
  const [submitError, setSubmitError] = useState(false);
  const model = useMemo(
    () => new UploadFormModel(evidenceRequestId, submissions),
    [submissions]
  );

  const handleSubmit = useCallback(
    async (values) => {
      try {
        await model.handleSubmit(values);
        onSuccess();
      } catch (err) {
        console.log(err);
        setSubmitError(true);
      }
    },
    [model, setSubmitError]
  );

  return (
    <Formik
      initialValues={model.initialValues}
      validationSchema={model.schema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, setFieldValue, isSubmitting }) => (
        <Form>
          {submitError && (
            <ErrorMessage>
              There was an error. Please try again later
            </ErrorMessage>
          )}

          {submissions.map(({ id, documentType }) => (
            <UploaderPanel
              setFieldValue={setFieldValue}
              key={id}
              label={documentType.title}
              hint={documentType.description}
              name={id}
              set={!!values[id as keyof typeof values]}
              error={getError(id, touched, errors)}
            />
          ))}

          <Button type="submit" disabled={isSubmitting}>
            Continue
          </Button>
        </Form>
      )}
    </Formik>
  );
};

interface Props {
  evidenceRequestId: string;
  submissions: DocumentSubmission[];
  onSuccess(): void;
}

export default UploaderForm;
