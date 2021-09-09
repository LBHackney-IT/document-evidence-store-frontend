import React from 'react';
import { DocumentSubmission } from '../domain/document-submission';
import { formatDate } from '../helpers/formatters';

const History = (props: Props): JSX.Element => {
  return (
    <table className="govuk-table lbh-table">
      <tbody className="govuk-table__body">
        <tr className="govuk-table__row">
          <td className="govuk-table__cell"></td>
          <td className="govuk-table__cell">Valid until</td>
          <td className="govuk-table__cell">
            {props.documentSubmission.claimValidUntil
              .toLocal()
              .toFormat('d LLLL y')}
          </td>
        </tr>
        <tr className="govuk-table__row">
          <td className="govuk-table__cell"></td>
          <td className="govuk-table__cell">Retention expires</td>
          <td className="govuk-table__cell">
            {props.documentSubmission.retentionExpiresAt
              .toLocal()
              .toFormat('d LLLL y')}
          </td>
        </tr>
        {props.documentSubmission.rejectedAt && (
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">
              {props.documentSubmission.userUpdatedBy}
            </td>
            <td className="govuk-table__cell">
              Requested a new file with reason:
              <br />
              <span className="lbh-rejection-reason">
                "{props.documentSubmission.rejectionReason}"
              </span>
            </td>
            <td className="govuk-table__cell">
              {formatDate(props.documentSubmission.rejectedAt)}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export interface Props {
  documentSubmission: DocumentSubmission;
}

export default History;
