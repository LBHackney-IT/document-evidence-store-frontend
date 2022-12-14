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
  it('renders the form', () => {
    const { getByLabelText } = render(
      <Formik
        initialValues={initialValues}
        validationSchema={createResidentSchema}
        onSubmit={jest.fn()}
      >
        <Form>
          <CreateResidentForm createResident={jest.fn()} />
          <button type="submit">Continue</button>
        </Form>
      </Formik>
    );

    expect(getByLabelText('Name')).toBeInTheDocument();
    expect(getByLabelText('Email Address')).toBeInTheDocument();
    expect(getByLabelText('Phone Number')).toBeInTheDocument();
  });

  it('calls the submit handler with the right values', async () => {
    const createResident = jest.fn();

    render(<CreateResidentForm createResident={createResident} />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Name/i), 'Test Resident');
    await user.type(screen.getByLabelText(/Email Address/i), 'resident@email');
    await user.type(screen.getByLabelText(/Phone Number/i), '0700000');

    await user.click(
      screen.getByRole('button', {
        name: /Create/i,
      })
    );

    await waitFor(() =>
      expect(createResident).toHaveBeenCalledWith({
        name: 'Test Resident',
        email: 'resident@email',
        phoneNumber: '0700000',
      })
    );
  });
  it('displays an error message if there is an error in submission', async () => {
    const createResidentFailure = jest.fn().mockImplementation(() => {
      throw new Error('User already exists');
    });

    render(<CreateResidentForm createResident={createResidentFailure} />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Name/i), 'Test Resident');
    await user.type(screen.getByLabelText(/Email Address/i), 'resident@email');
    await user.type(screen.getByLabelText(/Phone Number/i), '0700000');

    await user.click(
      screen.getByRole('button', {
        name: /Create/i,
      })
    );

    await waitFor(() => {
      expect(screen.getByText(/User already exists/gi)).toBeInTheDocument();
    });
  });
});
