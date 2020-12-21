import React from 'react';
import { render, screen } from '@testing-library/react';
import UploaderForm from './UploaderForm';
import singleEvidenceRequestFixture from '../../test/fixture/evidence-request-response-singular.json';
import documentTypesFixture from '../../test/fixture/document-types-response.json';
import { ResponseMapper } from '../boundary/response-mapper';

describe('UploaderForm', () => {
  it('renders an uploader panel and a continue button', async () => {
    const documentTypes = documentTypesFixture.map((dt) =>
      ResponseMapper.mapDocumentType(dt)
    );
    const evidenceRequest = ResponseMapper.mapEvidenceRequest(
      singleEvidenceRequestFixture
    );

    render(
      <UploaderForm
        requestId="foo"
        documentTypes={documentTypes}
        evidenceRequest={evidenceRequest}
      />
    );
    expect(screen.getByText('Passport'));
    expect(screen.getByText('A valid passport open at the photo page'));
    // expect(screen.getByText('Browse...'));
    expect(screen.getByText('Continue'));
  });
});
