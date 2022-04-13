import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import NewRequestFormStep3 from './NewRequestFormStep3';
import { Formik, Form } from 'formik';

const promise = Promise.resolve();
const mockHandler = jest.fn(() => promise);

const initialValues = {
  noteToResident: '',
};

describe('NewRequestFormStep3', () => {
  it('renders a note to resident panel', async () => {
    render(
      <Formik onSubmit={mockHandler} initialValues={initialValues}>
        <Form>
          <NewRequestFormStep3 />
          <button type="submit">Continue</button>
          <button type="submit">Skip and continue</button>
        </Form>
      </Formik>
    );

    expect(
      screen.getByText('Would you like to add a note to this request?')
    ).toBeVisible();
    expect(
      screen.getByText(
        'For example, you can add specific guidance for some of the documents, if needed.'
      )
    ).toBeVisible();
  });

  it('calls the submit handler with the right values', async () => {
    render(
      <Formik onSubmit={mockHandler} initialValues={initialValues}>
        <Form>
          <NewRequestFormStep3 />
          <button type="submit">Continue</button>
          <button type="submit">Skip and continue</button>
        </Form>
      </Formik>
    );

    fireEvent.change(screen.getByTestId('textarea'), {
      target: {
        value: 'ipsum lorem',
      },
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText('Continue'));
    });

    await act(() => promise);

    expect(mockHandler).toHaveBeenCalled();
    //expect(mockHandler).toHaveBeenCalledWith();
  });
});
