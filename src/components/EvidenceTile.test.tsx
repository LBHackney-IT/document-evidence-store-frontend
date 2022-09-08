import React from 'react';
import { render, screen } from '@testing-library/react';
import { EvidenceTile } from './EvidenceTile';
import { DocumentState } from '../domain/document-submission';

describe('EvidenceTile', () => {
  it('renders all the data expected', async () => {
    render(
      <EvidenceTile
        teamId="123"
        residentId="123"
        id="123"
        title="Foo"
        createdAt="1 day ago"
        fileSizeInBytes={1024}
        format="PDF"
        purpose="Example form"
        toReview
        state={DocumentState.APPROVED}
        reason={'housing reason'}
        requestedBy={'ash@dummy.com'}
      />
    );
    expect(screen.getByText('Foo'));
    expect(screen.getByText('Date created: 1 day ago'));
    expect(screen.getByText('(PDF 1.0 KB)'));
    expect(screen.getByText('APPROVED'));
  });

  it('renders without actions if document has already been reviewed', async () => {
    render(
      <EvidenceTile
        teamId="123"
        residentId="123"
        id="123"
        title="Foo"
        createdAt="1 day ago"
        fileSizeInBytes={1024}
        format="PDF"
        purpose="Example form"
        state={DocumentState.APPROVED}
        reason={'housing reason'}
        requestedBy={'ash@dummy.com'}
      />
    );
    expect(screen.queryByText('Accept')).toBeNull();
    expect(screen.queryByText('Request new file')).toBeNull();
  });
});
