import React from 'react';
import {
  render,
  fireEvent,
  screen,
  waitFor,
  act,
} from '@testing-library/react';
import NewRequestFormStep1 from './NewRequestFormStep1';
import { Formik, Form } from 'formik';
import { schemaNewRequestFormStep1 } from './NewRequestFormStep1';

const promise = Promise.resolve();
const mockHandler = jest.fn(() => promise);

const team = {
  name: 'Example Service',
  googleGroup: 'example-service',
  id: '1',
  reasons: [
    {
      name: 'example-reason',
      id: '123',
    },
  ],
  landingMessage: 'example landing',
  slaMessage: 'example message',
};

const initialValues = {
  resident: {
    name: '',
    email: '',
    phoneNumber: '',
  },
  team: team.name,
  reason: team.reasons[0].name,
  emailCheckbox: '',
  phoneNumberCheckbox: '',
};

const formValues = {
  deliveryMethods: ['EMAIL', 'SMS'],
  resident: {
    email: 'example@email.com',
    name: 'Example name',
    phoneNumber: '07777777777',
  },
  team: 'Example Service',
  reason: 'example-reason',
  emailCheckbox: ['example@email.com'],
  phoneNumberCheckbox: ['07777777777'],
};

const fillInForm = () => {
  fireEvent.change(screen.getByLabelText('Name'), {
    target: { value: formValues.resident.name },
  });
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: formValues.resident.email },
  });
  fireEvent.change(screen.getByLabelText('Mobile phone number'), {
    target: { value: formValues.resident.phoneNumber },
  });
  fireEvent.click(screen.getByLabelText('Send request by SMS'));
  fireEvent.click(screen.getByLabelText('Send request by email'));
};

describe('NewRequestFormStep1', () => {
  it('renders an uploader panel', async () => {
    render(
      <Formik onSubmit={mockHandler} initialValues={initialValues}>
        <Form>
          <NewRequestFormStep1 team={team} />
          <button type="submit">Continue</button>
        </Form>
      </Formik>
    );

    expect(screen.getByLabelText('Name')).toBeVisible();
    expect(screen.getByLabelText('Email')).toBeVisible();
    expect(screen.getByLabelText('Mobile phone number')).toBeVisible();

    expect(screen.getByLabelText('Send request by SMS')).toBeDisabled();
    expect(screen.getByLabelText('Send request by email')).toBeDisabled();
  });

  it('validates all three contact details', async () => {
    render(
      <Formik
        validationSchema={schemaNewRequestFormStep1}
        onSubmit={mockHandler}
        initialValues={initialValues}
      >
        <Form>
          <NewRequestFormStep1 team={team} />
          <button type="submit">Continue</button>
        </Form>
      </Formik>
    );
    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(
        screen.getByText("Please enter the resident's name")
      ).toBeVisible();
      expect(
        screen.getAllByText('Please provide either an email or a phone number')
      ).toHaveLength(2);
    });
  });

  it('calls the submit handler', async () => {
    render(
      <Formik
        validationSchema={schemaNewRequestFormStep1}
        onSubmit={mockHandler}
        initialValues={initialValues}
      >
        <Form>
          <NewRequestFormStep1 team={team} />
          <button type="submit">Continue</button>
        </Form>
      </Formik>
    );

    fillInForm();

    await waitFor(() => {
      fireEvent.click(screen.getByText('Continue'));
    });

    // https://egghead.io/lessons/jest-fix-the-not-wrapped-in-act-warning
    await act(() => promise);

    expect(mockHandler).toHaveBeenCalled;
  });
});
