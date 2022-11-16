import React, {
  FunctionComponent,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { Formik, Form, FormikTouched, FormikErrors } from 'formik';
import UploaderPanel from './UploaderPanel';
import { StaffUploadFormModel } from '../services/staff-upload-form-model';
import { DocumentType } from '../domain/document-type';
import { LoadingBox } from 'govuk-react';
import PageWarning from 'src/components/PageWarning';

const getError = (
  id: string,
  touched: FormikTouched<File>,
  errors: FormikErrors<File>
) => {
  const dirty = touched[id as keyof typeof touched];
  if (!dirty) return null;
  return errors[id as keyof typeof errors] as string;
};

const StaffUploaderForm: FunctionComponent<Props> = ({
  residentId,
  staffSelectedDocumentTypes,
  onSuccess,
}) => {
  const [submitError, setSubmitError] = useState(false);
  const [submission, setSubmission] = useState(false);
  const model = useMemo(
    () => new StaffUploadFormModel(staffSelectedDocumentTypes),
    [staffSelectedDocumentTypes]
  );

  const handleSubmit = useCallback(
    async (values) => {
      setSubmission(true);
      try {
        await model.handleSubmit(values, residentId);
        onSuccess();
      } catch (err) {
        console.log(err);
        setSubmitError(true);
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
          {submission && (
            <PageWarning
              title="Your documents are being uploaded"
              content="Please do not close or refresh this page"
            />
          )}
          {staffSelectedDocumentTypes.map((staffSelectedDocumentType) => (
            <UploaderPanel
              setFieldValue={setFieldValue}
              key={staffSelectedDocumentType.id}
              label={staffSelectedDocumentType.title}
              hint={staffSelectedDocumentType.description}
              name={staffSelectedDocumentType.id}
              set={
                !!values[staffSelectedDocumentType.id as keyof typeof values]
              }
              error={getError(staffSelectedDocumentType.id, touched, errors)}
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
  residentId: string;
  staffSelectedDocumentTypes: DocumentType[];
  onSuccess(): void;
}

export default StaffUploaderForm;
