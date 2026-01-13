import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EvidenceTile } from './EvidenceTile';
import { DocumentState } from '../domain/document-submission';

describe('EvidenceTile', () => {
  const mockOnDeleteClick = jest.fn();

  it('renders all the data expected', async () => {
    render(
      <EvidenceTile
        id="123"
        title="Foo"
        createdAt="1 day ago"
        fileSizeInBytes={1024}
        format="PDF"
        state={DocumentState.APPROVED}
        reason={'housing reason'}
        requestedBy={'ash@dummy.com'}
        userUpdatedBy={'approver1@email.com'}
        documentDescription={'This is the description'}
        onDeleteClick={mockOnDeleteClick}
        isSuperUser={true}
      />
    );
    expect(screen.getByText('Foo'));
    expect(screen.getByText('Date uploaded: 1 day ago'));
    expect(screen.getByText('(PDF 1.0 KB)'));
    expect(screen.getByText('APPROVED'));
    expect(screen.getByText('Approved by approver1@email.com'));
    expect(screen.getByText('housing reason'));
    expect(screen.getByText('Description: This is the description'));
  });

  it('renders without actions if document has already been reviewed', async () => {
    render(
      <EvidenceTile
        id="123"
        title="Foo"
        createdAt="1 day ago"
        fileSizeInBytes={1024}
        format="PDF"
        state={DocumentState.APPROVED}
        reason={'housing reason'}
        requestedBy={'ash@dummy.com'}
        userUpdatedBy={'approver1@email.com'}
        onDeleteClick={mockOnDeleteClick}
        isSuperUser={true}
      />
    );
    expect(screen.queryByText('Accept')).toBeNull();
    expect(screen.queryByText('Request new file')).toBeNull();
  });

  it('renders with undefined values', () => {
    render(
      <EvidenceTile
        id="123"
        title="Foo"
        createdAt="1 day ago"
        fileSizeInBytes={1024}
        format={undefined}
        state={DocumentState.APPROVED}
        reason={undefined}
        requestedBy={undefined}
        userUpdatedBy={null}
        documentDescription={undefined}
        onDeleteClick={mockOnDeleteClick}
        isSuperUser={true}
      />
    );

    expect(screen.queryByText('format')).toBeNull();
    expect(screen.queryByText('Requested by')).toBeNull();
    expect(screen.queryByTestId('reason')).toBeNull();
    expect(screen.queryByTestId('Approved by')).toBeNull();
  });

  it('displays correct tag color for REJECTED', async () => {
    render(
      <EvidenceTile
        id="123"
        title="Foo"
        createdAt="1 day ago"
        fileSizeInBytes={1024}
        format="PDF"
        state={DocumentState.REJECTED}
        reason={'housing reason'}
        requestedBy={'ash@dummy.com'}
        userUpdatedBy={'approver2@email.com'}
        onDeleteClick={mockOnDeleteClick}
        isSuperUser={true}
      />
    );
    expect(screen.getByText('REJECTED')).toHaveClass('lbh-tag--red');
  });

  it('displays correct tag color for APPROVED ', async () => {
    render(
      <EvidenceTile
        id="123"
        title="Foo"
        createdAt="1 day ago"
        fileSizeInBytes={1024}
        format="PDF"
        state={DocumentState.APPROVED}
        reason={'housing reason'}
        requestedBy={'ash@dummy.com'}
        userUpdatedBy={'approver2@email.com'}
        onDeleteClick={mockOnDeleteClick}
        isSuperUser={true}
      />
    );
    expect(screen.getByText('APPROVED')).toHaveClass('lbh-tag--green');
  });

  it('displays correct tag color for PENDING REVIEW and translates UPLOADED state to PENDING REVIEW', async () => {
    render(
      <EvidenceTile
        id="123"
        title="Foo"
        createdAt="1 day ago"
        fileSizeInBytes={1024}
        format="PDF"
        state={DocumentState.UPLOADED}
        reason={'housing reason'}
        requestedBy={'ash@dummy.com'}
        userUpdatedBy={'approver2@email.com'}
        onDeleteClick={mockOnDeleteClick}
        isSuperUser={true}
      />
    );
    expect(screen.getByText('PENDING REVIEW')).toHaveClass('lbh-tag--blue');
    expect(screen.queryByText('UPLOADED')).toBeNull();
  });

  describe('Delete functionality', () => {
    beforeEach(() => {
      mockOnDeleteClick.mockClear();
    });

    it('displays delete button when isSuperUser is true', () => {
      render(
        <EvidenceTile
          id="123"
          title="Foo"
          createdAt="1 day ago"
          fileSizeInBytes={1024}
          format="PDF"
          state={DocumentState.APPROVED}
          reason={'housing reason'}
          requestedBy={'ash@dummy.com'}
          userUpdatedBy={'approver1@email.com'}
          onDeleteClick={mockOnDeleteClick}
          isSuperUser={true}
        />
      );
      expect(screen.getByTestId('delete-button-123')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('does not display delete button when isSuperUser is false', () => {
      render(
        <EvidenceTile
          id="123"
          title="Foo"
          createdAt="1 day ago"
          fileSizeInBytes={1024}
          format="PDF"
          state={DocumentState.APPROVED}
          reason={'housing reason'}
          requestedBy={'ash@dummy.com'}
          userUpdatedBy={'approver1@email.com'}
          onDeleteClick={mockOnDeleteClick}
          isSuperUser={false}
        />
      );
      expect(screen.queryByTestId('delete-button-123')).not.toBeInTheDocument();
    });

    it('calls onDeleteClick when delete button is clicked', () => {
      render(
        <EvidenceTile
          id="123"
          title="Foo"
          createdAt="1 day ago"
          fileSizeInBytes={1024}
          format="PDF"
          state={DocumentState.APPROVED}
          reason={'housing reason'}
          requestedBy={'ash@dummy.com'}
          userUpdatedBy={'approver1@email.com'}
          onDeleteClick={mockOnDeleteClick}
          isSuperUser={true}
        />
      );

      const deleteButton = screen.getByTestId('delete-button-123');
      fireEvent.click(deleteButton);

      expect(mockOnDeleteClick).toHaveBeenCalledTimes(1);
    });

    it('delete button has correct styling for super users', () => {
      render(
        <EvidenceTile
          id="123"
          title="Foo"
          createdAt="1 day ago"
          fileSizeInBytes={1024}
          format="PDF"
          state={DocumentState.APPROVED}
          reason={'housing reason'}
          requestedBy={'ash@dummy.com'}
          userUpdatedBy={'approver1@email.com'}
          onDeleteClick={mockOnDeleteClick}
          isSuperUser={true}
        />
      );

      const deleteButton = screen.getByTestId('delete-button-123');
      expect(deleteButton).toHaveStyle({
        backgroundColor: 'white',
        color: 'rgb(190, 58, 52)',
      });
    });
  });
});
