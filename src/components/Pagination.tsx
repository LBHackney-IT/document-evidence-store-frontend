import React, { FunctionComponent, useState, useEffect } from 'react';

export const Pagination: FunctionComponent<Props> = (props: Props) => {
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    setTotalPages(Math.ceil(props.total / props.pageSize));
  }, []);

  const handlePaginate = (targetPage: number) => {
    props.onPageChange(targetPage);
  };

  const generatePaginationLinks = () => {
    const pages = [];
    for (let page = 1; page <= totalPages; page++) {
      pages.push(
        <li className="lbh-pagination__item">
          <a
            className="lbh-pagination__link"
            href="#"
            key={page}
            aria-label={`page ${page}`}
            onClick={() => handlePaginate(page)}
          >
            {page}
          </a>
        </li>
      );
    }
    return pages;
  };

  return (
    <nav className="lbh-pagination">
      <ul className="lbh-pagination">
        {props.currentPageNumber != 1 && (
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
        {props.currentPageNumber != totalPages && (
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
