import React from 'react';
import { render } from '@testing-library/react';
import CreateResidentForm from './CreateResidentForm';
import { createResidentSchema } from './CreateResidentForm';

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
        validationSchema={createResidentSchema}
        onSubmit={jest.fn()}
      >
        <Form>
          <CreateResidentForm onSuccess={jest.fn()} />
          <button type="submit">Continue</button>
        </Form>
      </Formik>
    );

    expect(getByLabelText('Name')).toBeInTheDocument();
    expect(getByLabelText('Email Address')).toBeInTheDocument();
    expect(getByLabelText('Phone Number')).toBeInTheDocument();
  });

  //TODO: add more tests
});
