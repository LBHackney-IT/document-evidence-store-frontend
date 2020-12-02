import React, { useState } from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Dialog from './Dialog';

test('is properly titled, displays children, and is visible if open', async () => {
  render(
    <Dialog open={true} onDismiss={() => {}} title="Example dialog">
      Content here
    </Dialog>
  );
  expect(screen.getByText('Content here'));
  expect(screen.getByLabelText('Example dialog'));
});

test('is invisible if not open', async () => {
  render(
    <Dialog open={false} onDismiss={() => {}} title="Example dialog">
      Content here
    </Dialog>
  );
  expect(screen.queryByText('Content here')).toBeNull();
});
