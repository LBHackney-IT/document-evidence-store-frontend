import Link from 'next/link';
import React, { FunctionComponent, useMemo } from 'react';
import { EvidenceRequest } from '../domain/evidence-request';

export const ResidentTable: FunctionComponent<Props> = ({
  residents,
  teamId,
}) => {
  const rows = useMemo(
    () =>
      residents.map((row) => {
        return {
          id: row.resident.id + row.createdAt,
          residentId: row.resident.id,
          residentName: row.resident.name,
          document: row.documentTypes.map((dt) => dt.title).join(', '),
          uploaded: `${row.createdAt.toRelative()}`,
        };
      }),
    [residents]
  );

  return (
    <table className="govuk-table  lbh-table">
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          <th scope="col" className="govuk-table__header">
            Resident
          </th>
          <th
            scope="col"
            className="govuk-table__header govuk-table__header--numeric"
          >
            Document
          </th>
          <th
            scope="col"
            className="govuk-table__header govuk-table__header--numeric"
          >
            Uploaded
          </th>
          <th
            scope="col"
            className="govuk-table__header govuk-table__header--numeric"
          >
            <span className="govuk-visually-hidden">Action</span>
          </th>
        </tr>
      </thead>

      <tbody className="govuk-table__body">
        {rows.map((row) => (
          <tr className="govuk-table__row" key={row.id}>
            <td className="govuk-table__cell">
              <Link href={`/teams/${teamId}/dashboard/residents/${row.residentId}`}>
                <a className="lbh-link">{row.residentName}</a>
              </Link>
            </td>
            <td className="govuk-table__cell govuk-table__cell--numeric">
              {row.document}
            </td>
            <td className="govuk-table__cell govuk-table__cell--numeric">
              {row.uploaded}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

type Props = {
  residents: EvidenceRequest[];
  teamId: string;
};
