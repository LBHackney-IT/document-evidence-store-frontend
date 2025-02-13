import React from 'react';
import { DocumentSubmission } from '../domain/document-submission';
import { Resident } from '../domain/resident';
import { formatDate } from '../helpers/formatters';
import { formatDateWithoutTime } from '../helpers/formatters';

const History = (props: Props): JSX.Element => {
  return (
    <table className="govuk-table lbh-table">
      <tbody className="govuk-table__body">
        <tr className="govuk-table__row">
          <td className="govuk-table__cell"></td>
          <td className="govuk-table__cell">Valid until</td>
          <td className="govuk-table__cell">
            {formatDateWithoutTime(props.documentSubmission.claimValidUntil)}
          </td>
        </tr>
        <tr className="govuk-table__row">
          <td className="govuk-table__cell"></td>
          <td className="govuk-table__cell">Retention expires</td>
          <td className="govuk-table__cell">
            {formatDateWithoutTime(props.documentSubmission.retentionExpiresAt)}
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
                &quot;{props.documentSubmission.rejectionReason}&quot;
              </span>
            </td>
            <td className="govuk-table__cell">
              {formatDate(props.documentSubmission.rejectedAt)}
            </td>
          </tr>
        )}
        {props.documentSubmission.acceptedAt && (
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">
              {props.documentSubmission.userUpdatedBy}
            </td>
            <td className="govuk-table__cell">{`Accepted this file as ${props.documentSubmission.staffSelectedDocumentType?.title}`}</td>
            <td className="govuk-table__cell">
              {formatDate(props.documentSubmission.acceptedAt)}
            </td>
          </tr>
        )}
        {props.documentSubmission.createdAt && (
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">{props.resident.name}</td>
            <td className="govuk-table__cell">Uploaded this file</td>
            <td className="govuk-table__cell">
              {formatDate(props.documentSubmission.createdAt)}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export interface Props {
  documentSubmission: DocumentSubmission;
  resident: Resident;
}

export default History;
