import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import DocumentTypeAndDescription from './DocumentTypeAndDescription';
import { DocumentType } from '../domain/document-type';
import { Formik, Form } from 'formik';
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
    fireEvent.change(descriptionField, {
      target: { value: 'test description' },
    });

    expect(screen.getByLabelText('Document type')).toHaveValue();
    expect(descriptionField).toHaveTextContent('test description');
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
    expect(screen.getByLabelText('Description')).toHaveProperty(
      'error',
      'this is a test error'
    );
  });
});
