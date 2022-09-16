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
          <td className="govuk-table__cell" data-testid="name-cell">
            {resident.name}
          </td>
        </tr>
        <tr className="govuk-table__row">
          <th scope="row" className="govuk-table__header">
            Mobile number
          </th>
          {resident.phoneNumber?.length ? (
            <td className="govuk-table__cell" data-testid="number-cell">
              {resident.phoneNumber}
            </td>
          ) : (
            <td className="govuk-table__cell" data-testid={'blankNumber-cell'}>
              -
            </td>
          )}
        </tr>
        <tr className="govuk-table__row">
          <th scope="row" className="govuk-table__header">
            Email address
          </th>
          {resident.email?.length ? (
            <td className="govuk-table__cell" data-testid="email-cell">
              {resident.email}
            </td>
          ) : (
            <td className="govuk-table__cell" data-testid="blankEmail-cell">
              -
            </td>
          )}
        </tr>
      </tbody>
    </table>
  );
};
export interface Props {
  resident: Resident;
}

export default ResidentPageTable;
