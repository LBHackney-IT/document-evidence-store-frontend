import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import DocumentTypeAndDescription from './DocumentTypeAndDescription';
import { DocumentType } from '../domain/document-type';

describe('DocumentTypeAndDescription', () => {
  it('renders the expected data', () => {
    const testDocTypes: DocumentType[] = [];
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
});
