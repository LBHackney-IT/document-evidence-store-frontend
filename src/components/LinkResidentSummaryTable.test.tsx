import LinkResidentSummaryTable from './LinkResidentSummaryTable';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { User } from 'src/domain/user';
import { Team } from 'src/domain/team';
import { Resident } from '../domain/resident';

const testTeam: Team = {
  name: 'test',
  googleGroup: '2',
  id: '1',
  reasons: [],
  landingMessage: 'test message',
  slaMessage: 'sla message',
};
const testUser: User = {
  groups: [],
  name: 'Test User',
  email: 'test@test.com',
};

const testResidents: Resident[] = [
  {
    name: 'testResident One',
    email: 'test@test.com',
    phoneNumber: null,
    id: 'testResidentId-1',
  },
  {
    name: 'testResident Two',
    email: 'test@test.com',
    phoneNumber: '01156987521',
    id: 'testResidentId-2',
  },
];

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null),
    };
  },
}));

jest.mock('next/link', () => ({ children }: HTMLElement) => children);

beforeEach(() => {
  render(
    <LinkResidentSummaryTable
      user={testUser}
      team={testTeam}
      residents={testResidents}
    />
  );
});

describe('LinkResidentSummaryTable', () => {
  it('renders the expected component, with the expected number of rows', () => {
    expect(screen.getByTestId('link-resident-summary-tr-0')).toHaveTextContent(
      'testResident One'
    );
    expect(screen.getByTestId('link-resident-summary-tr-1')).toHaveTextContent(
      'testResident Two'
    );
  });

  it('opens the confirmation dialog when the link button is clicked', () => {
    fireEvent.click(screen.getByText('Link residents'));
    expect(
      screen.getByText(
        'Are you sure you want to link the Housing Register resident with this DES resident?'
      )
    ).toBeInTheDocument();
  });
});
