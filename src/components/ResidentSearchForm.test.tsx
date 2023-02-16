import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ResidentSearchForm from './ResidentSearchForm';

describe('ResidentSearchForm', () => {
  const teamId = '2';

  it('renders an input and button', async () => {
    render(
      <ResidentSearchForm
        handleSearch={jest.fn()}
        teamId={teamId}
        isFromDeeplink={false}
        name={''}
        email={''}
        phone={''}
        groupId={''}
      />
    );
    expect(screen.getByPlaceholderText('Search by name or contact detail'));
    expect(screen.getByText('Search'));
  });

  it('submits successfully', async () => {
    const mockHandler = jest.fn();
    render(
      <ResidentSearchForm
        handleSearch={mockHandler}
        teamId={teamId}
        isFromDeeplink={false}
        name={''}
        email={''}
        phone={''}
        groupId={''}
      />
    );
    fireEvent.change(
      screen.getByPlaceholderText('Search by name or contact detail'),
      {
        target: {
          value: 'example',
        },
      }
    );
    fireEvent.click(screen.getByText('Search'));
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  it('does not submit if search query is white space', async () => {
    const mockHandler = jest.fn();
    render(
      <ResidentSearchForm
        handleSearch={mockHandler}
        teamId={teamId}
        isFromDeeplink={false}
        name={''}
        email={''}
        phone={''}
        groupId={''}
      />
    );
    fireEvent.change(
      screen.getByPlaceholderText('Search by name or contact detail'),
      {
        target: {
          value: '   ',
        },
      }
    );
    fireEvent.click(screen.getByText('Search'));
    expect(mockHandler).toHaveBeenCalledTimes(0);
  });
});
