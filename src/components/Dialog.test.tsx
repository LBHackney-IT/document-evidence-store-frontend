import React from 'react';
import { render, screen } from '@testing-library/react';
import Dialog from './Dialog';

const dismissSpy = jest.fn();

test('is properly titled, displays children, and is visible if open', async () => {
  render(
    <Dialog open={true} onDismiss={dismissSpy} title="Example dialog">
      Content here
    </Dialog>
  );
  expect(screen.getByText('Content here'));
  expect(screen.getByLabelText('Example dialog'));
});

test('is invisible if not open', async () => {
  render(
    <Dialog open={false} onDismiss={dismissSpy} title="Example dialog">
      Content here
    </Dialog>
  );
  expect(screen.queryByText('Content here')).toBeNull();
});
