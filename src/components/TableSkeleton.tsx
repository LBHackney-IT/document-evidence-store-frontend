import React from 'react';
import styles from '../styles/TableSkeleton.module.scss';

const TableSkeleton = (props: Props): JSX.Element => (
  <table
    aria-label="Loading..."
    className={`govuk-table lbh-table ${styles.table}`}
  >
    <thead className="govuk-table__head">
      <tr className="govuk-table__row">
        {props.columns.map((col) => (
          <th className="govuk-table__header" key={col}>
            {col}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="govuk-table__body">
      <tr className="govuk-table__row">
        {props.columns.map((col) => (
          <td className="govuk-table__cell" key={col}>
            <div className={styles.content}></div>
          </td>
        ))}
      </tr>
      <tr className="govuk-table__row">
        {props.columns.map((col) => (
          <td className="govuk-table__cell" key={col}>
            <div className={styles.content}></div>
          </td>
        ))}
      </tr>
      <tr className="govuk-table__row">
        {props.columns.map((col) => (
          <td className="govuk-table__cell" key={col}>
            <div className={styles.content}></div>
          </td>
        ))}
      </tr>
    </tbody>
  </table>
);

interface Props {
  columns: string[];
}

export default TableSkeleton;
