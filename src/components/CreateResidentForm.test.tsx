import React from 'react';
import { render } from '@testing-library/react';
import CreateResidentForm from './CreateResidentForm';
import { schemaCreateResidentForm } from './CreateResidentForm';

import { Formik, Form } from 'formik';

describe('CreateResidentForm', () => {
  it('should render the form', () => {
    const { getByLabelText } = render(
      <Formik
        initialValues={{
          name: '',
          email: '',
          phoneNumber: '',
        }}
        validationSchema={schemaCreateResidentForm}
        onSubmit={jest.fn()}
      >
        <Form>
          <CreateResidentForm />
          <button type="submit">Continue</button>
        </Form>
      </Formik>
    );

    expect(getByLabelText('Name')).toBeInTheDocument();
    expect(getByLabelText('Email')).toBeInTheDocument();
    expect(getByLabelText('Mobile phone number')).toBeInTheDocument();
  });
});
