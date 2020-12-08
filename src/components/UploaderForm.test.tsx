import React from 'react';
import { render, screen } from '@testing-library/react';
import UploaderForm from './UploaderForm';
import { InternalApiGateway } from '../gateways/internal-api';

test('it renders an uploader panel and a continue button', async () => {
  const gateway = new InternalApiGateway();
  const documentTypes = await gateway.getDocumentTypes(true);
  const evidenceRequest = await gateway.getEvidenceRequest(true);

  render(
    <UploaderForm
      requestId="foo"
      documentTypes={documentTypes}
      evidenceRequest={evidenceRequest}
    />
  );
  expect(screen.getByText('Passport'));
  expect(screen.getByText('A valid passport open at the photo page'));
  expect(screen.getByText('Browse...'));
  expect(screen.getByText('Continue'));
});
