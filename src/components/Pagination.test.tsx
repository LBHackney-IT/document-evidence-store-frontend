import React from 'react';
import { render, screen } from '@testing-library/react';
import { Pagination } from './Pagination';

const mockHandler = jest.fn();

describe('Pagination', () => {
  it('renders the correct number of page links, based on the input', () => {
    const currentPageNumber = 1;
    const pageSize = 10;
    const total = 30;
    const onPageChange = mockHandler;

    render(
      <Pagination
        currentPageNumber={currentPageNumber}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
      />
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });
});
