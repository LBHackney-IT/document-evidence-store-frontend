import React from 'react';
import { render } from '@testing-library/react';
import ImagePreview from './ImagePreview';
import { DocumentSubmission } from '../domain/document-submission';
import { Document } from '../domain/document';
import { mockPartial } from '../../test/helpers/mock-partial';
import { DocumentType } from '../domain/document-type';

test('it renders correctly', async () => {
  const downloadUrl = 'www.download-link.com';
  const mockDocSub = mockPartial<DocumentSubmission>({
    documentType: mockPartial<DocumentType>({
      title: 'proof-of-id',
    }),
    document: mockPartial<Document>({
      fileType: 'image/jpeg',
      fileSizeInBytes: 500,
    }),
  });

  render(
    <ImagePreview documentSubmission={mockDocSub} downloadUrl={downloadUrl} />
  );
});
