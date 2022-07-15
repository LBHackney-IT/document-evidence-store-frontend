import React, { FunctionComponent } from 'react';

const FileFormatDetails: FunctionComponent = () => (
  <details className="govuk-details lbh-details" data-module="govuk-details">
    <summary className="govuk-details__summary">
      <span
        className="govuk-details__summary-text"
        data-testid="photo-info-details-title"
      >
        How to photograph your documents
      </span>
    </summary>
    <div className="govuk-details__text" data-testid="photo-info-details-text">
      <p className="lbh-body">
        You can use your smartphone camera. First, make sure you’re in a
        well-lit place.
      </p>
      <p className="lbh-body">
        Lie the document flat and try not to cover any part of it.
      </p>
      <p className="lbh-body">Make sure the whole document is in the frame.</p>
    </div>
  </details>
);

export default FileFormatDetails;
