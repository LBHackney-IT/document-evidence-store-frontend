import React from 'react';
import { render } from '@testing-library/react';
import UploaderForm from './UploaderForm';
import { InternalApiGateway } from '../gateways/internal-api';

test('', async () => {
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
});
