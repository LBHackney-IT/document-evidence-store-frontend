import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';

test('renders correctly when logged in', async () => {
  render(<Header userName="Namey McName" />);
  expect(screen.getByText('Upload'));
  expect(screen.getByText('Namey McName'));
  expect(screen.getByText('Sign out'));
});

test('renders correctly when logged out', async () => {
  render(<Header />);
  expect(screen.queryByText('Upload')).toBeNull();
  expect(screen.queryByText('Sign out')).toBeNull();
});
