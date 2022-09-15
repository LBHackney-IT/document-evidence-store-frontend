import { render, screen } from '@testing-library/react';
import React from 'react';
import { EvidenceAwaitingSubmissionTile } from './EvidenceAwaitingSubmissionTile';
import { DateTime } from 'luxon';

describe('EvidenceAwaitingSubmissionTile', () => {
  it('renders the expected data', () => {
    const date = DateTime.local(2022, 8, 25, 11, 28).setLocale('en-gb');
    render(
      <EvidenceAwaitingSubmissionTile
        id={123}
        documentType={'Proof of ID'}
        dateRequested={date}
        requestedBy={'example@example.com'}
        reason={'this is a reason'}
      ></EvidenceAwaitingSubmissionTile>
    );
    expect(screen.getByText('Proof of ID'));
    expect(
      screen.getByText('Date requested: 11:28 am 25 August 2022 (last month)')
    );
    expect(screen.getByText('Requested by: example@example.com'));
    expect(screen.getByText('this is a reason'));
  });
});
