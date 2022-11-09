import React, { FunctionComponent, useState, useEffect } from 'react';

const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(0);

export const Pagination: FunctionComponent<Props> = (props: Props) => {
  useEffect(() => {
    setTotalPages(Math.ceil(props.total / props.pageSize));
  }, []);

  const handlePaginate = (nextPageNumber: number) => {
    setCurrentPage(nextPageNumber);
    props.onPageChange(nextPageNumber);
  };

  const generatePaginationLinks = () => {
    for (let page = 1; page <= props.total; page++) {
      return (
        <li className="govuk-pagination__item">
          <a
            className="govuk-link govuk-pagination__link"
            href="#"
            aria-label={`page ${page}`}
          >
            {page}
          </a>
        </li>
      );
    }
  };

  return (
    <nav className="lbh-pagination">
      <ul className="lbh-pagination">
        {currentPage != 1 && (
          <li className="lbh-pagination__item">
            <a
              className="lbh-pagination__link"
              href="#"
              aria-label="Previous page"
              onClick={() => handlePaginate(props.currentPageNumber - 1)}
            >
              <span aria-hidden="true" role="presentation">
                &laquo;
              </span>
              Previous
            </a>
          </li>
        )}
        <>{generatePaginationLinks()}</>
        {currentPage != totalPages && (
          <li className="lbh-pagination__item">
            <a
              className="lbh-pagination__link"
              href="#"
              aria-label="Next page"
              onClick={() => handlePaginate(props.currentPageNumber + 1)}
            >
              Next
              <span aria-hidden="true" role="presentation">
                &raquo;
              </span>
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
};

export interface Props {
  currentPageNumber: number;
  pageSize: number;
  total: number;
  onPageChange: (pageNumber: number) => void;
}
