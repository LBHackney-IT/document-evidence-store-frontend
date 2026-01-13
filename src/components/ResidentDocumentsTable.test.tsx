import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { ResidentDocumentsTable } from './ResidentDocumentsTable';
import { EvidenceRequestsFixture } from './fixtures/evidence-requests';
import { DocumentSubmissionsFixture } from './fixtures/document-submissions';
import { DateTime } from 'luxon';
import { Resident } from '../domain/resident';

const EvidenceAwaitingSubmissionFixture = [
  {
    documentType: 'passport',
    dateRequested: DateTime.fromISO('2022-09-19T15:34:12.299Z'),
    requestedBy: 'test0@hackney.gov.uk',
    reason: 'Awaiting submission reason',
  },
];

const mockResident = new Resident({
  id: 'test-resident-id',
  name: 'Test Resident',
  email: 'test@example.com',
  phoneNumber: '07123456789',
});

describe('ResidentDocumentsTable', () => {
  it('renders the expected component with tabs', () => {
    render(
      <ResidentDocumentsTable
        evidenceRequests={EvidenceRequestsFixture}
        awaitingSubmissions={EvidenceAwaitingSubmissionFixture}
        documentSubmissions={DocumentSubmissionsFixture}
        total={10}
        pageSize={10}
        onPageOrTabChange={() => Promise.resolve()}
        resident={mockResident}
        isSuperUser={true}
        isSuperUserDeleteEnabled={true}
        userEmail="test@hackney.gov.uk"
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
        awaitingSubmissions={EvidenceAwaitingSubmissionFixture}
        documentSubmissions={DocumentSubmissionsFixture}
        total={10}
        pageSize={10}
        onPageOrTabChange={() => Promise.resolve()}
        resident={mockResident}
        isSuperUser={true}
        isSuperUserDeleteEnabled={true}
        userEmail="test@hackney.gov.uk"
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
        awaitingSubmissions={EvidenceAwaitingSubmissionFixture}
        documentSubmissions={DocumentSubmissionsFixture}
        total={10}
        pageSize={10}
        onPageOrTabChange={() => Promise.resolve()}
        resident={mockResident}
        isSuperUser={true}
        isSuperUserDeleteEnabled={true}
        userEmail="test@hackney.gov.uk"
      />
    );

    expect(screen.getByTestId('all-documents-section')).toHaveTextContent(
      'Proof of ID'
    );
    // expect(screen.getByTestId('awaiting-submission-section')).toHaveTextContent(
    //   'Proof of Address'
    // );
    expect(screen.getByTestId('approved-section')).toHaveTextContent(
      'Proof of ID'
    );
    expect(screen.getByTestId('rejected-section')).toHaveTextContent(
      'Proof of ID'
    );
  });

  describe('Super user delete functionality', () => {
    beforeEach(() => {
      // Mock window.location.reload
      delete (window as any).location;
      (window as any).location = { reload: jest.fn() };
      // Mock fetch
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('shows delete button when both isSuperUser and isSuperUserDeleteEnabled are true', () => {
      render(
        <ResidentDocumentsTable
          evidenceRequests={EvidenceRequestsFixture}
          awaitingSubmissions={EvidenceAwaitingSubmissionFixture}
          documentSubmissions={DocumentSubmissionsFixture}
          total={10}
          pageSize={10}
          onPageOrTabChange={() => Promise.resolve()}
          resident={mockResident}
          isSuperUser={true}
          isSuperUserDeleteEnabled={true}
          userEmail="test@hackney.gov.uk"
        />
      );

      const deleteButtons = screen.getAllByText('Delete');
      expect(deleteButtons.length).toBeGreaterThan(0);
    });

    it('does not show delete button when isSuperUser is false', () => {
      render(
        <ResidentDocumentsTable
          evidenceRequests={EvidenceRequestsFixture}
          awaitingSubmissions={EvidenceAwaitingSubmissionFixture}
          documentSubmissions={DocumentSubmissionsFixture}
          total={10}
          pageSize={10}
          onPageOrTabChange={() => Promise.resolve()}
          resident={mockResident}
          isSuperUser={false}
          isSuperUserDeleteEnabled={true}
          userEmail="test@hackney.gov.uk"
        />
      );

      expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    });

    it('does not show delete button when isSuperUserDeleteEnabled is false', () => {
      render(
        <ResidentDocumentsTable
          evidenceRequests={EvidenceRequestsFixture}
          awaitingSubmissions={EvidenceAwaitingSubmissionFixture}
          documentSubmissions={DocumentSubmissionsFixture}
          total={10}
          pageSize={10}
          onPageOrTabChange={() => Promise.resolve()}
          resident={mockResident}
          isSuperUser={true}
          isSuperUserDeleteEnabled={false}
          userEmail="test@hackney.gov.uk"
        />
      );

      expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    });

    it('does not show delete button when both isSuperUser and isSuperUserDeleteEnabled are false', () => {
      render(
        <ResidentDocumentsTable
          evidenceRequests={EvidenceRequestsFixture}
          awaitingSubmissions={EvidenceAwaitingSubmissionFixture}
          documentSubmissions={DocumentSubmissionsFixture}
          total={10}
          pageSize={10}
          onPageOrTabChange={() => Promise.resolve()}
          resident={mockResident}
          isSuperUser={false}
          isSuperUserDeleteEnabled={false}
          userEmail="test@hackney.gov.uk"
        />
      );

      expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    });
  });

  describe('Feature flag behavior', () => {
    beforeEach(() => {
      delete (window as any).location;
      (window as any).location = { reload: jest.fn() };
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('feature flag acts as a kill switch - disabled feature flag overrides super user status', () => {
      render(
        <ResidentDocumentsTable
          evidenceRequests={EvidenceRequestsFixture}
          awaitingSubmissions={EvidenceAwaitingSubmissionFixture}
          documentSubmissions={DocumentSubmissionsFixture}
          total={10}
          pageSize={10}
          onPageOrTabChange={() => Promise.resolve()}
          resident={mockResident}
          isSuperUser={true}
          isSuperUserDeleteEnabled={false}
          userEmail="super.user@hackney.gov.uk"
        />
      );

      // Even though user is a super user, feature flag prevents delete button
      expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    });

    it('feature flag enabled without super user permission does not show delete button', () => {
      render(
        <ResidentDocumentsTable
          evidenceRequests={EvidenceRequestsFixture}
          awaitingSubmissions={EvidenceAwaitingSubmissionFixture}
          documentSubmissions={DocumentSubmissionsFixture}
          total={10}
          pageSize={10}
          onPageOrTabChange={() => Promise.resolve()}
          resident={mockResident}
          isSuperUser={false}
          isSuperUserDeleteEnabled={true}
          userEmail="regular.user@hackney.gov.uk"
        />
      );

      // Feature flag is enabled but user lacks super user permission
      expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    });

    it('requires both feature flag AND super user permission to show delete button', () => {
      const { rerender } = render(
        <ResidentDocumentsTable
          evidenceRequests={EvidenceRequestsFixture}
          awaitingSubmissions={EvidenceAwaitingSubmissionFixture}
          documentSubmissions={DocumentSubmissionsFixture}
          total={10}
          pageSize={10}
          onPageOrTabChange={() => Promise.resolve()}
          resident={mockResident}
          isSuperUser={false}
          isSuperUserDeleteEnabled={false}
          userEmail="test@hackney.gov.uk"
        />
      );

      // Neither condition met - no button
      expect(screen.queryByText('Delete')).not.toBeInTheDocument();

      // Rerender with only super user permission
      rerender(
        <ResidentDocumentsTable
          evidenceRequests={EvidenceRequestsFixture}
          awaitingSubmissions={EvidenceAwaitingSubmissionFixture}
          documentSubmissions={DocumentSubmissionsFixture}
          total={10}
          pageSize={10}
          onPageOrTabChange={() => Promise.resolve()}
          resident={mockResident}
          isSuperUser={true}
          isSuperUserDeleteEnabled={false}
          userEmail="test@hackney.gov.uk"
        />
      );

      // Only super user permission - still no button
      expect(screen.queryByText('Delete')).not.toBeInTheDocument();

      // Rerender with only feature flag enabled
      rerender(
        <ResidentDocumentsTable
          evidenceRequests={EvidenceRequestsFixture}
          awaitingSubmissions={EvidenceAwaitingSubmissionFixture}
          documentSubmissions={DocumentSubmissionsFixture}
          total={10}
          pageSize={10}
          onPageOrTabChange={() => Promise.resolve()}
          resident={mockResident}
          isSuperUser={false}
          isSuperUserDeleteEnabled={true}
          userEmail="test@hackney.gov.uk"
        />
      );

      // Only feature flag - still no button
      expect(screen.queryByText('Delete')).not.toBeInTheDocument();

      // Rerender with both conditions met
      rerender(
        <ResidentDocumentsTable
          evidenceRequests={EvidenceRequestsFixture}
          awaitingSubmissions={EvidenceAwaitingSubmissionFixture}
          documentSubmissions={DocumentSubmissionsFixture}
          total={10}
          pageSize={10}
          onPageOrTabChange={() => Promise.resolve()}
          resident={mockResident}
          isSuperUser={true}
          isSuperUserDeleteEnabled={true}
          userEmail="test@hackney.gov.uk"
        />
      );

      // Both conditions met - button appears
      const deleteButtons = screen.getAllByText('Delete');
      expect(deleteButtons.length).toBeGreaterThan(0);
    });

    it('feature flag can be toggled to enable/disable functionality without code changes', () => {
      const { rerender } = render(
        <ResidentDocumentsTable
          evidenceRequests={EvidenceRequestsFixture}
          awaitingSubmissions={EvidenceAwaitingSubmissionFixture}
          documentSubmissions={DocumentSubmissionsFixture}
          total={10}
          pageSize={10}
          onPageOrTabChange={() => Promise.resolve()}
          resident={mockResident}
          isSuperUser={true}
          isSuperUserDeleteEnabled={false}
          userEmail="test@hackney.gov.uk"
        />
      );

      // Feature disabled
      expect(screen.queryByText('Delete')).not.toBeInTheDocument();

      // Toggle feature flag on
      rerender(
        <ResidentDocumentsTable
          evidenceRequests={EvidenceRequestsFixture}
          awaitingSubmissions={EvidenceAwaitingSubmissionFixture}
          documentSubmissions={DocumentSubmissionsFixture}
          total={10}
          pageSize={10}
          onPageOrTabChange={() => Promise.resolve()}
          resident={mockResident}
          isSuperUser={true}
          isSuperUserDeleteEnabled={true}
          userEmail="test@hackney.gov.uk"
        />
      );

      // Feature enabled - buttons appear
      const deleteButtons = screen.getAllByText('Delete');
      expect(deleteButtons.length).toBeGreaterThan(0);

      // Toggle feature flag off again
      rerender(
        <ResidentDocumentsTable
          evidenceRequests={EvidenceRequestsFixture}
          awaitingSubmissions={EvidenceAwaitingSubmissionFixture}
          documentSubmissions={DocumentSubmissionsFixture}
          total={10}
          pageSize={10}
          onPageOrTabChange={() => Promise.resolve()}
          resident={mockResident}
          isSuperUser={true}
          isSuperUserDeleteEnabled={false}
          userEmail="test@hackney.gov.uk"
        />
      );

      // Feature disabled again - buttons disappear
      expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    });

    it('opens confirmation dialog when delete button is clicked', () => {
      render(
        <ResidentDocumentsTable
          evidenceRequests={EvidenceRequestsFixture}
          awaitingSubmissions={EvidenceAwaitingSubmissionFixture}
          documentSubmissions={DocumentSubmissionsFixture}
          total={10}
          pageSize={10}
          onPageOrTabChange={() => Promise.resolve()}
          resident={mockResident}
          isSuperUser={true}
          isSuperUserDeleteEnabled={true}
          userEmail="test@hackney.gov.uk"
        />
      );

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
      expect(screen.getByText(/You are about to delete/i)).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    });

    it('closes confirmation dialog when cancel is clicked', () => {
      render(
        <ResidentDocumentsTable
          evidenceRequests={EvidenceRequestsFixture}
          awaitingSubmissions={EvidenceAwaitingSubmissionFixture}
          documentSubmissions={DocumentSubmissionsFixture}
          total={10}
          pageSize={10}
          onPageOrTabChange={() => Promise.resolve()}
          resident={mockResident}
          isSuperUser={true}
          isSuperUserDeleteEnabled={true}
          userEmail="test@hackney.gov.uk"
        />
      );

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();
    });

    it('calls API and reloads page on successful delete', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      render(
        <ResidentDocumentsTable
          evidenceRequests={EvidenceRequestsFixture}
          awaitingSubmissions={EvidenceAwaitingSubmissionFixture}
          documentSubmissions={DocumentSubmissionsFixture}
          total={10}
          pageSize={10}
          onPageOrTabChange={() => Promise.resolve()}
          resident={mockResident}
          isSuperUser={true}
          isSuperUserDeleteEnabled={true}
          userEmail="test@hackney.gov.uk"
        />
      );

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      const confirmButton = screen.getByRole('button', {
        name: 'Confirm Delete',
      });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/document_submissions/'),
          expect.objectContaining({
            method: 'PATCH',
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
              useremail: 'test@hackney.gov.uk',
            }),
          })
        );
      });

      await waitFor(() => {
        expect(window.location.reload).toHaveBeenCalled();
      });
    });

    it('displays error message on failed delete', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      render(
        <ResidentDocumentsTable
          evidenceRequests={EvidenceRequestsFixture}
          awaitingSubmissions={EvidenceAwaitingSubmissionFixture}
          documentSubmissions={DocumentSubmissionsFixture}
          total={10}
          pageSize={10}
          onPageOrTabChange={() => Promise.resolve()}
          resident={mockResident}
          isSuperUser={true}
          isSuperUserDeleteEnabled={true}
          userEmail="test@hackney.gov.uk"
        />
      );

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      const confirmButton = screen.getByRole('button', {
        name: 'Confirm Delete',
      });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(
          screen.getByText('Failed to delete document. Please try again.')
        ).toBeInTheDocument();
      });

      // Dialog should remain open
      expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    });

    it('displays error message on network error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      render(
        <ResidentDocumentsTable
          evidenceRequests={EvidenceRequestsFixture}
          awaitingSubmissions={EvidenceAwaitingSubmissionFixture}
          documentSubmissions={DocumentSubmissionsFixture}
          total={10}
          pageSize={10}
          onPageOrTabChange={() => Promise.resolve()}
          resident={mockResident}
          isSuperUser={true}
          isSuperUserDeleteEnabled={true}
          userEmail="test@hackney.gov.uk"
        />
      );

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      const confirmButton = screen.getByRole('button', {
        name: 'Confirm Delete',
      });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('disables buttons during delete operation', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 100)
          )
      );

      render(
        <ResidentDocumentsTable
          evidenceRequests={EvidenceRequestsFixture}
          awaitingSubmissions={EvidenceAwaitingSubmissionFixture}
          documentSubmissions={DocumentSubmissionsFixture}
          total={10}
          pageSize={10}
          onPageOrTabChange={() => Promise.resolve()}
          resident={mockResident}
          isSuperUser={true}
          isSuperUserDeleteEnabled={true}
          userEmail="test@hackney.gov.uk"
        />
      );

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      const confirmButton = screen.getByRole('button', {
        name: 'Confirm Delete',
      });
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });

      fireEvent.click(confirmButton);

      // Buttons should be disabled during operation
      await waitFor(() => {
        expect(confirmButton.closest('button')).toBeDisabled();
        expect(cancelButton.closest('button')).toBeDisabled();
      });
    });

    it('displays correct document details in confirmation dialog', () => {
      render(
        <ResidentDocumentsTable
          evidenceRequests={EvidenceRequestsFixture}
          awaitingSubmissions={EvidenceAwaitingSubmissionFixture}
          documentSubmissions={DocumentSubmissionsFixture}
          total={10}
          pageSize={10}
          onPageOrTabChange={() => Promise.resolve()}
          resident={mockResident}
          isSuperUser={true}
          isSuperUserDeleteEnabled={true}
          userEmail="test@hackney.gov.uk"
        />
      );

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      expect(screen.getByText(/Test Resident/)).toBeInTheDocument();
      expect(screen.getAllByText(/Proof of ID/)[0]).toBeInTheDocument();
    });
  });
});
