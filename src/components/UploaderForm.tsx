import React, {
  FunctionComponent,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { Formik, Form, FormikTouched, FormikErrors } from 'formik';
import UploaderPanel from './UploaderPanel';
import { UploadFormModel } from '../services/upload-form-model';
import { DocumentType } from '../domain/document-type';
import { LoadingBox } from 'govuk-react';

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
  evidenceRequestId,
  documentTypes,
  onSuccess,
}) => {
  const [submitError, setSubmitError] = useState(false);
  const [submission, setSubmission] = useState(false);
  const model = useMemo(() => new UploadFormModel(documentTypes), [
    documentTypes,
  ]);

  const handleSubmit = useCallback(
    async (values) => {
      setSubmission(true);
      try {
        await model.handleSubmit(values, evidenceRequestId);
        onSuccess();
      } catch (err) {
        console.log(err);
        setSubmitError(true);
      } finally {
        setSubmission(false);
      }
    },
    [model, submitError]
  );

  return (
    <Formik
      initialValues={model.initialValues}
      // validationSchema={model.schema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, setFieldValue, dirty }) => (
        <Form>
          {submitError && (
            <span className="govuk-error-message lbh-error-message">
              There was an error. Please try again later
            </span>
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

          <LoadingBox loading={submission}>
            <button
              className="govuk-button lbh-button"
              type="submit"
              disabled={!dirty || submission}
            >
              Continue
            </button>
          </LoadingBox>
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
