import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ResidentSearchForm from './ResidentSearchForm';

describe('ResidentSearchForm', () => {
  it('renders an input and button', async () => {
    render(<ResidentSearchForm handleSearch={jest.fn()} />);
    expect(screen.getByPlaceholderText('Search for a resident...'));
    expect(screen.getByText('Search'));
  });

  it('submits successfully', async () => {
    const mockHandler = jest.fn();
    render(<ResidentSearchForm handleSearch={mockHandler} />);
    fireEvent.change(screen.getByPlaceholderText('Search for a resident...'), {
      target: {
        value: 'example',
      },
    });
    fireEvent.click(screen.getByText('Search'));
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });
});
