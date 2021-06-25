import React from 'react';
import { DocumentSubmission } from '../domain/document-submission';
import { formatDate } from '../helpers/formatters';

const History = (props: Props): JSX.Element => {
  return (
    <table className="govuk-table lbh-table">
      <tbody className="govuk-table__body">
        {props.documentSubmission.rejectedAt && (
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">
              {props.documentSubmission.userRejectedBy}
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
