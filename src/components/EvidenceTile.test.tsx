import React from 'react';
import { render, screen } from '@testing-library/react';
import { EvidenceTile } from './EvidenceTile';

describe('EvidenceTile', () => {
  it('renders all the data expected', async () => {
    render(
      <EvidenceTile
        residentId="123"
        id="123"
        title="Foo"
        createdAt="1 day ago"
        fileSize={1024}
        format="PDF"
        purpose="Example form"
        toReview
      />
    );
    expect(screen.getByText('Foo'));
    expect(screen.getByText('1 day ago with Example form'));
    expect(screen.getByText('1.0 KB'));
    expect(screen.getByText('PDF'));
    expect(screen.getByText('Accept'));
    expect(screen.getByText('Request new file'));
  });

  it('renders without actions if document has already been reviewed', async () => {
    render(
      <EvidenceTile
        residentId="123"
        id="123"
        title="Foo"
        createdAt="1 day ago"
        fileSize={1024}
        format="PDF"
        purpose="Example form"
      />
    );
    expect(screen.queryByText('Accept')).toBeNull();
    expect(screen.queryByText('Request new file')).toBeNull();
  });
});
