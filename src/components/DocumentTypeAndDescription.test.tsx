import { render, screen } from '@testing-library/react';
import React from 'react';
import DocumentTypeAndDescription from './DocumentTypeAndDescription';
import { DocumentType } from '../domain/document-type';
import { Formik } from 'formik';

describe('DocumentTypeAndDescription', () => {
  const testDocTypes: DocumentType[] = [];
  it('renders the expected data', () => {
    render(
      <Formik
        initialValues={{ exampleName: false }}
        onSubmit={() => console.log('submitted')}
      >
        <DocumentTypeAndDescription
          name={'Test document'}
          documentTypes={testDocTypes}
          panelIndex={0}
        />
      </Formik>
    );
    const descriptionField = screen.getByLabelText('Description');
    const docField = screen.getByLabelText('Document type');

    expect(docField).toBeInTheDocument();
    expect(descriptionField).toBeInTheDocument();
  });
});
