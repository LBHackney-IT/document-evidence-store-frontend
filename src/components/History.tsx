import React from 'react';

const History = (): JSX.Element => {
  return (
    <table className="govuk-table lbh-table">
      <tbody className="govuk-table__body">
        <tr className="govuk-table__row">
          <td className="govuk-table__cell">
            <strong>Namey McName</strong> accepted this file
          </td>
          <td className="govuk-table__cell govuk-table__cell--numeric">
            1 hour ago
          </td>
        </tr>
        <tr className="govuk-table__row">
          <td className="govuk-table__cell">
            <strong>Firstname Surname</strong> uploaded a new file
          </td>
          <td className="govuk-table__cell govuk-table__cell--numeric">
            2 hours ago
          </td>
        </tr>
        <tr className="govuk-table__row">
          <td className="govuk-table__cell">Reminder sent</td>
          <td className="govuk-table__cell govuk-table__cell--numeric">
            1 week ago
          </td>
        </tr>
        <tr className="govuk-table__row">
          <td className="govuk-table__cell">Reminder sent</td>
          <td className="govuk-table__cell govuk-table__cell--numeric">
            2 weeks ago
          </td>
        </tr>
        <tr className="govuk-table__row">
          <td className="govuk-table__cell">
            <strong>Namey McName</strong> requested a new file with the reason:
            <p>"The image is too dark to see clearly"</p>
          </td>
          <td className="govuk-table__cell govuk-table__cell--numeric">
            3 weeks ago
          </td>
        </tr>
        <tr className="govuk-table__row">
          <td className="govuk-table__cell">
            <strong>Firstname Surname</strong> uploaded this file
          </td>
          <td className="govuk-table__cell govuk-table__cell--numeric">
            3 weeks ago
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default History;
