import { render, screen } from '@testing-library/react';
import React from 'react';
import DocumentTypeAndDescription from './DocumentTypeAndDescription';
import { DocumentType } from '../domain/document-type';
import { Formik } from 'formik';
import { UploaderPanelError } from './StaffUploaderForm';

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
          error={null}
        />
      </Formik>
    );
    const descriptionField = screen.getByLabelText('Description');
    const docField = screen.getByLabelText('Document type');

    expect(docField).toBeInTheDocument();
    expect(descriptionField).toBeInTheDocument();
  });
  it('renders an expected error', () => {
    const error: UploaderPanelError = {
      staffSelectedDocumentType: ' test',
      description: 'this is a test error',
      files: [],
    };

    render(
      <Formik
        initialValues={{ exampleName: false }}
        onSubmit={() => console.log('submitted')}
      >
        <DocumentTypeAndDescription
          name={'Test document'}
          documentTypes={testDocTypes}
          error={error}
        />
      </Formik>
    );
    expect(screen.getByText('this is a test error'));
  });
});
