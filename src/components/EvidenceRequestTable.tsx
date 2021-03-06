import React, { FunctionComponent, useMemo } from 'react';
import { EvidenceRequest } from '../domain/evidence-request';
import { sortEvidenceRequestsDescending } from '../helpers/sorters';

export const EvidenceRequestTable: FunctionComponent<Props> = ({
  requests,
}) => {
  const rows = useMemo(
    () =>
      sortEvidenceRequestsDescending(requests).map((row) => {
        return {
          id: row.id,
          resident: row.resident.name,
          document: row.documentTypes[0].title,
          made: `${row.createdAt.toRelative()}`,
          userRequestedBy: row.userRequestedBy,
        };
      }),
    [requests]
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
            Requested
          </th>
          <th scope="col" className="govuk-table__header">
            Requested By
          </th>
          {/* <th
            scope="col"
            className="govuk-table__header govuk-table__header--numeric"
          >
            <span className="govuk-visually-hidden">Action</span>
          </th> */}
        </tr>
      </thead>

      <tbody className="govuk-table__body">
        {rows.map((row) => (
          <tr className="govuk-table__row" key={row.id}>
            <td className="govuk-table__cell">{row.resident}</td>
            <td className="govuk-table__cell govuk-table__cell--numeric">
              {row.document}
            </td>
            <td className="govuk-table__cell govuk-table__cell--numeric">
              {row.made}
            </td>
            <td className="govuk-table__cell">{row.userRequestedBy}</td>
            {/* <td className="govuk-table__cell govuk-table__cell--numeric">
              <Link href="#">
                <a className="lbh-link">Remind</a>
              </Link>
              <Link href="#">
                <a className="lbh-link lbh-link--red">Cancel</a>
              </Link>
            </td> */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

type Props = {
  requests: EvidenceRequest[];
};
