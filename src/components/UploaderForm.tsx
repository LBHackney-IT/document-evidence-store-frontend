import React, {
  FunctionComponent,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { Button, ErrorMessage } from 'lbh-frontend-react';
import { Formik, Form, FormikTouched, FormikErrors } from 'formik';
import UploaderPanel from './UploaderPanel';
import { FormValues, UploadFormModel } from '../services/upload-form-model';
import { DocumentType } from '../domain/document-type';

const getError = (
  id: string,
  touched: FormikTouched<FormValues>,
  errors: FormikErrors<FormValues>
) => {
  const dirty = touched[id as keyof typeof touched];
  if (!dirty) return null;
  if (errors) return null;
  return errors[id as keyof typeof errors] as string;
};

const UploaderForm: FunctionComponent<Props> = ({
  evidenceRequestId,
  documentTypes,
  onSuccess,
}) => {
  const [submitError, setSubmitError] = useState(false);
  const model = useMemo(() => new UploadFormModel(documentTypes), [
    documentTypes,
  ]);

  const handleSubmit = useCallback(
    async (values) => {
      try {
        await model.handleSubmit(values, evidenceRequestId);
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

          {documentTypes.map((documentType) => (
            <UploaderPanel
              setFieldValue={setFieldValue}
              key={documentType.id}
              label={documentType.title}
              hint={documentType.description}
              name={documentType.id}
              set={!!values[documentType.id as keyof typeof values]}
              error={getError(documentType.id, touched, errors)}
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
  documentTypes: DocumentType[];
  onSuccess(): void;
}

export default UploaderForm;
