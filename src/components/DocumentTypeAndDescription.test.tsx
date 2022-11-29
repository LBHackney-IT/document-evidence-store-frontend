import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import DocumentTypeAndDescription from './DocumentTypeAndDescription';
import { DocumentType } from '../domain/document-type';
import { UploaderPanelError } from './StaffUploaderForm';

describe('DocumentTypeAndDescription', () => {
  const testDocTypes: DocumentType[] = [];
  it('renders the expected data', () => {
    render(
      <DocumentTypeAndDescription
        name={'Test document'}
        documentTypes={testDocTypes}
        error={null}
      />
    );
    const descriptionField = screen.getByLabelText('Description');
    fireEvent.change(descriptionField, {
      target: { value: 'test description' },
    });

    expect(screen.getByLabelText('Document type')).toHaveValue();
    expect(descriptionField).toHaveTextContent('test description');
  });
  it('renders an expected error', () => {
    var error: UploaderPanelError = {
      staffSelectedDocumentType: ' test',
      description: 'this is a test error',
      files: [],
    };
    render(
      <DocumentTypeAndDescription
        name={'Test document'}
        documentTypes={testDocTypes}
        error={error}
      />
    );
    expect(screen.getByLabelText('Description')).toHaveProperty(
      'error',
      'this is a test error'
    );
  });
});
