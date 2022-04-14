import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import NewRequestFormStep2 from './NewRequestFormStep2';
import { Formik, Form } from 'formik';
import { schemaNewRequestFormStep2 } from './NewRequestFormStep2';

const promise = Promise.resolve();
const mockHandler = jest.fn(() => promise);

const initialValues = {
  documentTypes: [],
};

const documentTypes = [
  {
    id: 'proof-of-id',
    title: 'Proof of ID',
    description: 'A document to prove your identity',
  },
  {
    id: 'passport-scan',
    title: 'Passport',
    description: 'A valid passport open at the photo page',
  },
];

const fillInForm = () => {
  fireEvent.click(screen.getByLabelText(documentTypes[0].title));
  fireEvent.click(screen.getByLabelText(documentTypes[1].title));
};

describe('NewRequestFormStep2', () => {
  it('renders a document panel', async () => {
    render(
      <Formik onSubmit={mockHandler} initialValues={initialValues}>
        <Form>
          <NewRequestFormStep2 documentTypes={documentTypes} />
          <button type="submit">Continue</button>
        </Form>
      </Formik>
    );

    expect(screen.getByText('Proof of ID')).toBeVisible();
    expect(screen.getByText('Passport')).toBeVisible();
  });

  it('validates at least one evidence type is present', async () => {
    render(
      <Formik
        onSubmit={mockHandler}
        initialValues={initialValues}
        validationSchema={schemaNewRequestFormStep2}
      >
        <Form>
          <NewRequestFormStep2 documentTypes={documentTypes} />
          <button type="submit">Continue</button>
        </Form>
      </Formik>
    );
    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(screen.getByText('Please choose a document type')).toBeVisible();
    });
  });

  it('calls the submit handler', async () => {
    render(
      <Formik
        onSubmit={mockHandler}
        initialValues={initialValues}
        validationSchema={schemaNewRequestFormStep2}
      >
        <Form>
          <NewRequestFormStep2 documentTypes={documentTypes} />
          <button type="submit">Continue</button>
        </Form>
      </Formik>
    );

    fillInForm();

    await waitFor(() => {
      fireEvent.click(screen.getByText('Continue'));
    });

    expect(mockHandler.mock.calls[0]).toEqual(
      expect.arrayContaining([
        {
          documentTypes: ['proof-of-id', 'passport-scan'],
        },
      ])
    );
  });
});
