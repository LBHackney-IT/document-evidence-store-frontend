import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardLayout from './DashboardLayout';

describe('DashboardLayout', () => {
  it('renders its children, and the correct header', async () => {
    render(<DashboardLayout>Example</DashboardLayout>);

    expect(screen.getByText('Example'));
    expect(screen.getByText('Housing benefit'));
  });

  it('renders a different header on the switch service screen', async () => {
    render(<DashboardLayout noService>Example</DashboardLayout>);

    expect(screen.getByText('Example'));
    expect(screen.getByText('Back to Housing benefit'));
  });
});
