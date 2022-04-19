import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TextAreaWithCharacterCount } from './TextAreaWithCharacterCount';
import { Formik, Form } from 'formik';

const promise = Promise.resolve();
const mockHandler = jest.fn(() => promise);

describe('TextAreaWithCharacterCount', () => {
  it('renders a text area with the correct character count and updates when text area value changes', async () => {
    const initialValues = {
      noteToResident: '',
    };
    render(
      <Formik onSubmit={mockHandler} initialValues={initialValues}>
        <Form>
          <TextAreaWithCharacterCount
            maxCharacterLength={6}
            name="noteToResident"
            id="noteToResident"
            dataTestId="testid"
            rows={5}
          />
        </Form>
      </Formik>
    );

    expect(screen.getByText('You have 6 characters remaining')).toBeVisible();
    expect(screen.getByTestId('testid')).toHaveProperty('value', '');

    fireEvent.change(screen.getByTestId('testid'), {
      target: {
        value: 'hello',
      },
    });

    await waitFor(() => {
      expect(screen.getByText('You have 1 character remaining')).toBeVisible();
    });
  });
});
