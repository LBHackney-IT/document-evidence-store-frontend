import React, { FunctionComponent } from 'react';

const FileFormatDetails: FunctionComponent = () => (
  <details className="govuk-details lbh-details" data-module="govuk-details">
    <summary className="govuk-details__summary">
      <span
        className="govuk-details__summary-text"
        data-testid="file-formats-details-title"
      >
        Which file formats are accepted?
      </span>
    </summary>
    <div
      className="govuk-details__text"
      data-testid="file-formats-details-text"
    >
      <strong>We currently support the following formats:</strong>
      <br />
      .doc, .pdf, .numbers, .pages, .xls, .xlsx, .docx, .bmp, .gif, .heic, .jpeg
      or .jpg, .png, .txt
    </div>
  </details>
);

export default FileFormatDetails;
