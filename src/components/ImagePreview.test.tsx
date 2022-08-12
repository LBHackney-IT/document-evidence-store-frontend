import React from 'react';
import { render } from '@testing-library/react';
import ImagePreview from './ImagePreview';
import { DocumentSubmission } from '../domain/document-submission';
import { Document } from '../domain/document';
import { mockPartial } from '../../test/helpers/mock-partial';
import { DocumentType } from '../domain/document-type';

describe('ImagePreview', () => {
  const downloadUrl = 'www.download-link.com';
  const mockDocSub = mockPartial<DocumentSubmission>({
    documentType: mockPartial<DocumentType>({
      title: 'proof-of-id',
    }),
    document: mockPartial<Document>({
      fileType: 'image/jpec',
      fileSizeInBytes: 500,
    }),
  });

  test('it renders correctly', async () => {
    render(
      <ImagePreview documentSubmission={mockDocSub} downloadUrl={downloadUrl} />
    );
  });
});
