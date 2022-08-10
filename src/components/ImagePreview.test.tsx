import React from 'react';
import { render } from '@testing-library/react';
import ImagePreview from './ImagePreview';
import { IDocumentSubmission } from '../domain/document-submission';
import { IDocument } from '../domain/document';
import { mockPartial } from '../../test/helpers/mock-partial';
import { IDocumentType } from '../domain/document-type';

test('it renders correctly', async () => {
  const downloadUrl = 'www.download-link.com';
  const mockDocSub = mockPartial<IDocumentSubmission>({
    documentType: mockPartial<IDocumentType>({
      title: 'proof-of-id',
    }),
    document: mockPartial<IDocument>({
      extension: 'jpeg',
      fileSizeInBytes: 500,
    }),
  });

  render(
    <ImagePreview documentSubmission={mockDocSub} downloadUrl={downloadUrl} />
  );
});
