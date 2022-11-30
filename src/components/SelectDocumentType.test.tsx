import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import SelectDocumentType from './SelectDocumentType';
import { Formik } from 'formik';

describe('SelectDocumentType', () => {
  it('is properly labelled', () => {
    render(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <SelectDocumentType
          label="Example label"
          name="exampleName"
          panelIndex={0}
          values={['documentType1', 'documentType2']}
        />
      </Formik>
    );
    expect(screen.getByLabelText('Example label'));
  });
  it('allows user to select from passed in documentTypes', () => {
    render(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <SelectDocumentType
          label="Example label"
          name="exampleName"
          panelIndex={0}
          values={['documentType1', 'documentType2']}
        />
      </Formik>
    );
    expect(screen.getAllByRole('option').length).toBe(2);

    userEvent.selectOptions(
      screen.getByRole('combobox'),
      screen.getByRole('option', { name: 'documentType2' })
    );

    const selectedOption = screen.getByRole('option', {
      name: 'documentType2',
    }) as HTMLSelectElement;

    expect(selectedOption).toBeInTheDocument();
  });
});
