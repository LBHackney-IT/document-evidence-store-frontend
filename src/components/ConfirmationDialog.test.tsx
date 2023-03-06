import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ConfirmDialog from './ConfirmationDialog';
import { User } from 'src/domain/user';
import { Team } from 'src/domain/team';

const onDismiss = jest.fn();
const residentIds = ['1442354', '1213124'];
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

describe('Confirm Dialog', () => {
  describe('when there is a request', () => {
    beforeEach(() => {
      render(
        <ConfirmDialog
          onDismiss={onDismiss}
          open={true}
          residentIds={residentIds}
          team={testTeam}
          user={testUser}
        />
      );
    });

    it('is open', () => {
      expect(screen.queryByRole('dialog')).toBeVisible();
    });

    it('has the correct text', () => {
      expect(
        screen.getByText(
          'Are you sure you want to link the Housing Register resident with this DES resident?'
        )
      ).toBeVisible();
    });

    it('calls the dismiss callback', () => {
      fireEvent.click(screen.getByText('No, cancel'));
      expect(onDismiss).toHaveBeenCalled();
    });
  });
});
