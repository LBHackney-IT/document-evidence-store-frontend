import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CreateResidentForm from './CreateResidentForm';
import { createResidentSchema } from './CreateResidentForm';
import { Formik, Form } from 'formik';
import userEvent from '@testing-library/user-event';

const initialValues = {
  name: '',
  email: '',
  phoneNumber: '',
};

describe('CreateResidentForm', () => {
  it('should render the form', () => {
    const { getByLabelText } = render(
      <Formik
        initialValues={initialValues}
        validationSchema={createResidentSchema}
        onSubmit={jest.fn()}
      >
        <Form>
          <CreateResidentForm onSuccess={jest.fn()} userEmail={'user@email'} />
          <button type="submit">Continue</button>
        </Form>
      </Formik>
    );

    expect(getByLabelText('Name')).toBeInTheDocument();
    expect(getByLabelText('Email Address')).toBeInTheDocument();
    expect(getByLabelText('Phone Number')).toBeInTheDocument();
  });

  xit('calls the submit handler with the right values', async () => {
    const successHandler = jest.fn();
    jest.mock('./CreateResidentForm', () => {
      const original = jest.requireActual('./CreateResidentForm');
      return {
        ...original,
        handleSubmit: successHandler,
      };
    });

    const testCall = jest.fn();

    render(
      <CreateResidentForm onSuccess={successHandler} userEmail={'user@email'} />
    );

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Name/i), 'Test Resident');
    await user.type(screen.getByLabelText(/Email Address/i), 'resident@email');
    await user.type(screen.getByLabelText(/Phone Number/i), '0700000');

    await user.click(screen.getByRole('button', { name: /Create/i }));

    await waitFor(() => expect(testCall).toHaveBeenCalled());
    // expect(screen.getByDisplayValue('resident@email')).toBeInTheDocument();

    // expect(mockHandler).toHaveBeenCalled();
    // expect(mockHandler.mock.calls[0]).toEqual(
    //   expect.arrayContaining([{ name: 'Test Resident' }])
    // );
    // expect(mockHandler).toHaveBeenCalledWith({
    //   name: 'Test Resident',
    //   email: 'resident@email',
    //   phoneNumber: '0700000',
    // });
  });
});
