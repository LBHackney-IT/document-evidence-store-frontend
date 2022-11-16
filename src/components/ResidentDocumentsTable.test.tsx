import { render, screen } from '@testing-library/react';
import React from 'react';
import { ResidentDocumentsTable } from './ResidentDocumentsTable';
import { EvidenceRequestsFixture } from './fixtures/evidence-requests';
import { DocumentSubmissionsFixture } from './fixtures/document-submissions';

const mockPaginationFunction = (_testBool: boolean) => {
  return;
};

describe('ResidentDocumentsTable', () => {
  it('renders the expected component with tabs', () => {
    render(
      <ResidentDocumentsTable
        evidenceRequests={EvidenceRequestsFixture}
        documentSubmissions={DocumentSubmissionsFixture}
        hidePaginationFunction={mockPaginationFunction}
      />
    );

    expect(screen.getByTestId('all-documents-tab')).toHaveTextContent(
      'All documents'
    );
    expect(screen.getByTestId('awaiting-submission-tab')).toHaveTextContent(
      'Awaiting submission'
    );
    expect(screen.getByTestId('pending-review-tab')).toHaveTextContent(
      'Pending review'
    );
    expect(screen.getByTestId('approved-tab')).toHaveTextContent('Approved');
    expect(screen.getByTestId('rejected-tab')).toHaveTextContent('Rejected');
  });

  it('render EvidenceTile and EvidenceAwaitingSubmissionTile components', () => {
    render(
      <ResidentDocumentsTable
        evidenceRequests={EvidenceRequestsFixture}
        documentSubmissions={DocumentSubmissionsFixture}
        hidePaginationFunction={mockPaginationFunction}
      />
    );
    const evidenceTiles = screen.getAllByTestId('all-documents-evidence-tile');
    expect(screen.getByTestId('all-documents-section')).toContainElement(
      evidenceTiles[0]
    );
  });

  it('renders a document in each of the status sections', () => {
    render(
      <ResidentDocumentsTable
        evidenceRequests={EvidenceRequestsFixture}
        documentSubmissions={DocumentSubmissionsFixture}
        hidePaginationFunction={mockPaginationFunction}
      />
    );

    expect(screen.getByTestId('all-documents-section')).toHaveTextContent(
      'Proof of ID'
    );
    expect(screen.getByTestId('awaiting-submission-section')).toHaveTextContent(
      'Proof of Address'
    );
    expect(screen.getByTestId('approved-section')).toHaveTextContent(
      'Proof of ID'
    );
    expect(screen.getByTestId('rejected-section')).toHaveTextContent(
      'Proof of ID'
    );
  });
});
