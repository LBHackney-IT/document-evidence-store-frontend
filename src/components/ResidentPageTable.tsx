import { Resident } from 'src/domain/resident';
import React, { FunctionComponent } from 'react';

const ResidentPageTable: FunctionComponent<Props> = (props) => {
  const { resident } = props;
  return (
    <table className="govuk-table lbh-table">
      <tbody className="govuk-table__body">
        <tr className="govuk-table__row">
          <th scope="row" className="govuk-table__header">
            Name
          </th>
          <td className="govuk-table__cell ">{resident.name}</td>
        </tr>
        <tr className="govuk-table__row">
          <th scope="row" className="govuk-table__header">
            Mobile Number
          </th>
          {resident.phoneNumber.length ? (
            <td className="govuk-table__cell">{resident.phoneNumber}</td>
          ) : (
            <td className="govuk-table__cell">-</td>
          )}
        </tr>
        <tr className="govuk-table__row">
          <th scope="row" className="govuk-table__header">
            Email
          </th>
          <td className="govuk-table__cell">{resident.email}</td>
        </tr>
      </tbody>
    </table>
  );
};
export interface Props {
  resident: Resident;
}

export default ResidentPageTable;
