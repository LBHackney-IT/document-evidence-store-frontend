import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UploaderForm from './UploaderForm';
import singleEvidenceRequestFixture from '../../test/fixture/evidence-request-response-singular.json';
import documentTypesFixture from '../../test/fixture/document-types-response.json';
import { ResponseMapper } from '../boundary/response-mapper';

const documentTypes = documentTypesFixture.map((dt) =>
  ResponseMapper.mapDocumentType(dt)
);
const evidenceRequest = ResponseMapper.mapEvidenceRequest(
  singleEvidenceRequestFixture
);

describe('UploaderForm', () => {
  it('renders an uploader panel and a continue button', async () => {
    render(
      <UploaderForm
        requestId="foo"
        documentTypes={documentTypes}
        evidenceRequest={evidenceRequest}
      />
    );
    expect(screen.getByText('Passport'));
    expect(screen.getByText('A valid passport open at the photo page'));
    expect(screen.getByText('Continue'));
  });

  it('validates files are attached', async () => {
    render(
      <UploaderForm
        requestId="foo"
        documentTypes={documentTypes}
        evidenceRequest={evidenceRequest}
      />
    );
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      expect(screen.getByText('Please select a file'));
    });
  });
});
