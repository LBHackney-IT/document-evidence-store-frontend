import { FunctionComponent, useState, useMemo } from 'react';
import { Button, ErrorMessage } from 'lbh-frontend-react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import UploaderPanel from './UploaderPanel';
import { useRouter } from 'next/router';
import { DocumentType } from '../domain/document-type';
import { EvidenceRequest } from '../domain/evidence-request';

const UploaderForm: FunctionComponent<Props> = (props) => {
  const router = useRouter();
  const { requestId } = router.query;
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

  console.log(initialValues);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={async (values) => {
        try {
          // using formdata to ensure file objects are correctly transmitted
          const formData = new FormData();
          for (const key in values) {
            formData.set(key, values[key]);
          }
          // process form here...
          router.push(`/resident/${requestId}/confirmation`);
        } catch (err) {
          console.log(err);
          setSubmitError(true);
        }
      }}
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
}

export default UploaderForm;
