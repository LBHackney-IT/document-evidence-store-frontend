import React, { FunctionComponent } from 'react';
//import { number } from 'yup'; commenting to push up with no errors

// const numberOfPages = (total: number, pageSize: number): number => {
//   return Math.ceil(total / pageSize);
// };

export const Pagination: FunctionComponent<Props> = (props: Props) => (
  <nav className="lbh-pagination">
    <ul className="lbh-pagination">
      <li className="lbh-pagination__item">
        {
          //don't display for first page
        }
        <a
          className="lbh-pagination__link"
          href="#"
          aria-label="Previous page"
          onClick={() => props.onPageChange(props.currentPageNumber - 1)}
        >
          <span aria-hidden="true" role="presentation">
            &laquo;
          </span>
          Previous
        </a>
      </li>
      <li className="lbh-pagination__item">
        {
          //don't display for last page
        }
        <a
          className="lbh-pagination__link"
          href="#"
          aria-label="Next page"
          onClick={() => props.onPageChange(props.currentPageNumber - 1)}
        >
          Next
          <span aria-hidden="true" role="presentation">
            &raquo;
          </span>
        </a>
      </li>
    </ul>
  </nav>
);

export interface Props {
  currentPageNumber: number;
  pageSize: number;
  total: number;
  onPageChange: (pageNumber: number) => void;
}
