import { render } from '@testing-library/react';
import React from 'react';
import { ResidentDocumentsTable } from './ResidentDocumentsTable';
import { EvidenceRequestsFixture } from './fixtures/evidence-requests';
import { DocumentSubmissionsFixture } from './fixtures/document-submissions';

describe('ResidentDocumentsTable', () => {
  const teamId = '1';
  const residentId = '3fa85f64-5717-4562-b3fc-2c963f66afr0';

  it('renders the expected data', () => {
    render(
      <ResidentDocumentsTable
        evidenceRequests={EvidenceRequestsFixture}
        documentSubmissions={DocumentSubmissionsFixture}
        teamId={teamId}
        residentId={residentId}
      />
    );
  });
});

//render
