import React, {
  FunctionComponent,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { Button, ErrorMessage } from 'lbh-frontend-react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import UploaderPanel from './UploaderPanel';
import { DocumentType } from '../domain/document-type';
import { EvidenceRequest } from '../domain/evidence-request';

const UploaderForm: FunctionComponent<Props> = (props) => {
  const [submitError, setSubmitError] = useState(false);

  const requestedDocuments = [props.evidenceRequest.documentType];

  const schema = useMemo(
    () =>
      Yup.object(
        requestedDocuments.reduce(
          (others, key) => ({
            ...others,
            [key.id]: Yup.mixed().required('Please select a file'),
          }),
          {}
        )
      ),
    [requestedDocuments]
  );

  const initialValues = useMemo(
    () =>
      requestedDocuments.reduce(
        (others, key) => ({
          ...others,
          [key.id]: '',
        }),
        {}
      ),
    [requestedDocuments]
  );

  const handleSubmit = useCallback(async (values) => {
    try {
      // using formdata to ensure file objects are correctly transmitted
      const formData = new FormData();
      for (const key in values) {
        formData.set(key, values[key]);
      }
      // process form here...
    } catch (err) {
      console.log(err);
      setSubmitError(true);
    }
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, setFieldValue, isSubmitting }) => (
        <Form>
          {submitError && (
            <ErrorMessage>
              There was an error. Please try again later
            </ErrorMessage>
          )}

          {requestedDocuments.map((document) => (
            <UploaderPanel
              setFieldValue={setFieldValue}
              key={document.id}
              label={document.title}
              hint={document.description}
              name={document.id}
              set={!!values[document.id]}
              error={touched[document.id] ? errors[document.id] : null}
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
  documentTypes: Array<DocumentType>;
  evidenceRequest: EvidenceRequest;
  requestId: string;
}

export default UploaderForm;
