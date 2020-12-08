import { useState } from 'react';
import { Button, ErrorMessage } from 'lbh-frontend-react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import UploaderPanel from './UploaderPanel';
import { useRouter } from 'next/router';

import evidenceTypes from '../pages/requests/_evidence-types.json';
import request from '../pages/requests/_pending-request.json';

const requestedIds = [].concat(request.document_type);

const schemaFromIds = (ids) =>
  ids.reduce(
    (o, key) => ({
      ...o,
      [key]: Yup.mixed().required('Please select a file'),
    }),
    {}
  );

const initialValuesFromIds = (ids) =>
  ids.reduce(
    (o, key) => ({
      ...o,
      [key]: '',
    }),
    {}
  );

const panelsFromIds = (ids) =>
  ids.map((id) => evidenceTypes.find((type) => type.id === id));

const schema = Yup.object(schemaFromIds(requestedIds));

const UploaderForm = (): JSX.Element => {
  const router = useRouter();
  const { requestId } = router.query;
  const [submitError, setSubmitError] = useState(false);

  return (
    <Formik
      initialValues={initialValuesFromIds(requestedIds)}
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

          {panelsFromIds(requestedIds).map((document) => (
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

export default UploaderForm;
