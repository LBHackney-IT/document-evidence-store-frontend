import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import RejectDialog from './RejectDialog';

const mockHandler = jest.fn();

describe('RejectDialog', () => {
  it('renders a textarea and two buttons', async () => {
    render(
      <RejectDialog
        onDismiss={mockHandler}
        open={true}
        onReject={mockHandler}
      />
    );
    expect(screen.getByLabelText('Reason for rejection'));
    expect(screen.getByText('No, cancel'));
    expect(screen.getByText('Request new file'));
  });

  it('validates that a reason is present', async () => {
    render(
      <RejectDialog
        onDismiss={mockHandler}
        open={true}
        onReject={mockHandler}
      />
    );
    fireEvent.click(screen.getByText('Request new file'));

    await waitFor(() => {
      expect(screen.getByText('Please give a reason'));
    });
  });

  it('prevents double-submits', async () => {
    render(
      <RejectDialog
        onDismiss={mockHandler}
        open={true}
        onReject={mockHandler}
      />
    );

    fireEvent.change(screen.getByLabelText('Reason for rejection'), {
      target: { value: 'Example reason' },
    });
    fireEvent.click(screen.getByText('Request new file'));

    const foundButton = screen.getByText('Request new file').closest('button');
    expect(foundButton && foundButton.disabled).toBeTruthy();
  });
});
