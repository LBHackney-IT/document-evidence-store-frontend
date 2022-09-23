import React from 'react';
import { render, screen } from '@testing-library/react';
import { EvidenceTile } from './EvidenceTile';
import { DocumentState } from '../domain/document-submission';

describe('EvidenceTile', () => {
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
      />
    );
    expect(screen.getByText('Foo'));
    expect(screen.getByText('Date uploaded: 1 day ago'));
    expect(screen.getByText('(PDF 1.0 KB)'));
    expect(screen.getByText('APPROVED'));
    expect(screen.getByText('Approved by approver1@email.com'));
    expect(screen.getByText('housing reason'));
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
      />
    );
    expect(screen.getByText('PENDING REVIEW')).toHaveClass('lbh-tag--blue');
    expect(screen.queryByText('UPLOADED')).toBeNull();
  });
});
