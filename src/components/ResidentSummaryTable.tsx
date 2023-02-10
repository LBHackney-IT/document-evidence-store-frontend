import React, { FunctionComponent, useMemo, useState } from 'react';
import { Resident } from '../domain/resident';
import Link from 'next/link';
import styles from '../styles/ResidentSummaryTable.module.scss';

export const ResidentSummaryTable: FunctionComponent<Props> = ({
  residents,
  teamId,
}) => {
  const rows = useMemo(
    () =>
      residents.map((row) => {
        return {
          id: row.id,
          referenceId: row.referenceId,
          name: row.name,
          email: row.email,
          phoneNumber: row.phoneNumber,
        };
      }),
    [residents]
  );

  const [loading, setIsLoading] = useState(false);

  return loading ? (
    <div className={styles.spinner}>
      <svg viewBox="0 0 42 42" stroke="#00703c" width="75" height="75">
        <g fill="none" fill-rule="evenodd">
          <g transform="translate(3 3)" stroke-width="5">
            <circle stroke-opacity=".5" cx="18" cy="18" r="18" />
            <path
              d="M36 18c0-9.94-8.06-18-18-18"
              transform="rotate(112.708 18 18)"
            />
          </g>
        </g>
      </svg>
    </div>
  ) : (
    <table className="govuk-table  lbh-table">
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          <th scope="col" className="govuk-table__header">
            ID
          </th>
          <th scope="col" className="govuk-table__header">
            Name
          </th>
          <th scope="col" className="govuk-table__header">
            Email
          </th>
          <th
            scope="col"
            className="govuk-table__header govuk-table__header--numeric"
          >
            Mobile phone number
          </th>
        </tr>
      </thead>
      <tbody className="govuk-table__body">
        {rows.map((row) => (
          <tr className="govuk-table__row" key={row.id}>
            <td className="govuk-table__cell">{row.referenceId}</td>
            <td className="govuk-table__cell">
              <Link href={`/teams/${teamId}/dashboard/residents/${row.id}`}>
                <a
                  className="lbh-link"
                  onClick={() => {
                    setIsLoading(!loading);
                  }}
                >
                  {row.name}
                </a>
              </Link>
            </td>
            <td className="govuk-table__cell">{row.email}</td>
            <td className="govuk-table__cell govuk-table__cell--numeric">
              {row.phoneNumber}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

interface Props {
  residents: Array<Resident>;
  teamId: string;
}

export default ResidentSummaryTable;
