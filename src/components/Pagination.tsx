import React, { FunctionComponent, useState, useEffect } from 'react';
import styles from '../styles/Pagination.module.scss';

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
            id={page == 1 ? 'focus-default' : ''}
            key={`pagination-${page}`}
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
    <nav className={styles.pagination_nav}>
      <ul className="lbh-pagination">
        <div className={styles.pagination_page}>Page</div>
        <>{generatePaginationLinks()}</>
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
