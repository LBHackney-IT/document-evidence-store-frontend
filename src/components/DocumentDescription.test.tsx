import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import DocumentDescription from './DocumentDescription';
import { Formik } from 'formik';

const submitSpy = jest.fn();

describe('DocumentDescription', () => {
  it('is properly named, labelled and responds to input', async () => {
    render(
      <Formik initialValues={{ exampleName: '' }} onSubmit={submitSpy}>
        <DocumentDescription
          label="Example label"
          name="exampleName"
          panelIndex={0}
        />
      </Formik>
    );
    expect(screen.getByLabelText('Example label'));
    expect(screen.getByRole('textbox')).toHaveProperty('name', 'exampleName');
    expect(screen.getByRole('textbox')).toHaveProperty('value', '');
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Example value' },
    });
    await waitFor(() =>
      expect(screen.getByRole('textbox')).toHaveProperty(
        'value',
        'Example value'
      )
    );
  });
  it('displays hints', () => {
    render(
      <Formik initialValues={{ exampleName: '' }} onSubmit={submitSpy}>
        <DocumentDescription
          label="Example label"
          name="exampleName"
          panelIndex={0}
          hint="Example hint"
        />
      </Formik>
    );
    expect(screen.getByText('Example hint'));
  });
});
