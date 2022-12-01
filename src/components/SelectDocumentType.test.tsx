import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import SelectDocumentType from './SelectDocumentType';
import { Formik } from 'formik';
import { IDocumentType } from 'src/domain/document-type';

describe('SelectDocumentType', () => {
  const documentTypes: IDocumentType[] = [
    { id: 'passport-scan', title: 'Passport scan' },
    { id: 'driving-license', title: 'Driving license' },
  ];
  it('is properly labelled', () => {
    render(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <SelectDocumentType
          label="Example label"
          name="exampleName"
          panelIndex={0}
          documentTypes={documentTypes}
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
          documentTypes={documentTypes}
        />
      </Formik>
    );
    expect(screen.getAllByRole('option').length).toBe(2);

    userEvent.selectOptions(
      screen.getByRole('combobox'),
      screen.getByRole('option', { name: documentTypes[1].title })
    );

    const selectedOption = screen.getByRole('option', {
      name: documentTypes[1].title,
    }) as HTMLSelectElement;

    expect(selectedOption).toBeInTheDocument();
  });
});
