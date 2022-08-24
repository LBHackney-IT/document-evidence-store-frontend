import { Resident } from 'src/domain/resident';
import React, { FunctionComponent } from 'react';

const ResidentPageTable: FunctionComponent<Props> = ({ resident }) => (
  <table className="govuk-table lbh-table">
    <tbody className="govuk-table__body">
      <tr className="govuk-table__row">
        <td className="govuk-table__cell">Name</td>
        <td className="govuk-table__cell ">{resident.name}</td>
      </tr>
      <tr className="govuk-table__row">
        <td className="govuk-table__cell">Mobile Number</td>
        {resident.phoneNumber.length ? (
          <td className="govuk-table__cell">{resident.phoneNumber}</td>
        ) : (
          <td className="govuk-table__cell">-</td>
        )}
      </tr>
      <tr className="govuk-table__row">
        <td className="govuk-table__cell">Email</td>
        <td className="govuk-table__cell">{resident.email}</td>
      </tr>
    </tbody>
  </table>
);

export interface Props {
  resident: Resident;
}

export default ResidentPageTable;
