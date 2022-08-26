import { render, screen } from '@testing-library/react';
import React from 'react';
import { EvidenceAwaitingSubmissionTile } from './EvidenceAwaitingSubmissionTile';

describe('EvidenceAwaitingSubmissionTile', () => {
  it('renders the expected data', () => {
    render(
      <EvidenceAwaitingSubmissionTile
        id={'123'}
        documentType={'Proof of ID'}
        dateRequested={'11:28 am 25 August 2022 (yesterday)'}
        requestedBy={'example@example.com'}
      ></EvidenceAwaitingSubmissionTile>
    );
    expect(screen.getByText('Proof of ID'));
    expect(
      screen.getByText('Date requested: 11:28 am 25 August 2022 (yesterday)')
    );
    expect(screen.getByText('Requested by: example@example.com'));
  });
});
