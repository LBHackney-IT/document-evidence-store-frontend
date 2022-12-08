import React, { FunctionComponent, useState, useEffect } from 'react';
import styles from '../styles/Pagination.module.scss';

export const Pagination: FunctionComponent<Props> = (props: Props) => {
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    setTotalPages(Math.ceil(props.total / props.pageSize));
  }, []);

  const handlePaginate = (targetPage: number) => {
    console.log('targetPage', targetPage);
    props.onPageOrTabChange(targetPage);
  };

  const generatePaginationLinks = () => {
    const pages = [];
    for (let page = 1; page <= totalPages; page++) {
      const current = page;
      pages.push(
        <li className="lbh-pagination__item" aria-label="pagination-item">
          <a
            className="lbh-pagination__link"
            href="#"
            key={`pagination-${current}`}
            aria-label={`page-${current}-link`}
            onClick={() => handlePaginate(current)}
          >
            {current}
          </a>
        </li>
      );
    }
    return pages;
  };

  return (
    <nav aria-label="pagination-nav" className={styles.pagination_nav}>
      <ul className="lbh-pagination" aria-label="pagination-list">
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
  onPageOrTabChange: (page: number) => void;
}
