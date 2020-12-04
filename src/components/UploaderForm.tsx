import { useState } from 'react';
import { Button, ErrorMessage } from 'lbh-frontend-react';
import Layout from './DashboardLayout';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import fetch from 'isomorphic-unfetch';
import UploaderPanel from './UploaderPanel';

import evidenceTypes from '../pages/requests/_evidence-types.json';
import request from '../pages/requests/_pending-request.json';

const requestedIds = [].concat(request.document_type);

const schemaFromIds = (ids) =>
  ids.reduce(
    (o, key) => ({
      ...o,
      [key]: Yup.string().required('Please select a file'),
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
  const [submitError, setSubmitError] = useState(false);

  return (
    <Formik
      initialValues={initialValuesFromIds(requestedIds)}
      validationSchema={schema}
      onSubmit={async (values) => {
        try {
          console.log(values);
          // process form here
        } catch (err) {
          setSubmitError(true);
        }
      }}
    >
      {({ values, errors, touched }) => (
        <Form>
          {submitError && (
            <ErrorMessage>
              There was an error. Please try again later
            </ErrorMessage>
          )}

          {panelsFromIds(requestedIds).map((document, i) => (
            <UploaderPanel
              key={document.id}
              label={document.title}
              hint={document.description}
              name={document.id}
              set={!!values[document.id]}
              error={touched[document.id] ? errors[document.id] : null}
            />
          ))}

          <Button type="submit">Continue</Button>
        </Form>
      )}
    </Formik>
  );
};

export default UploaderForm;
