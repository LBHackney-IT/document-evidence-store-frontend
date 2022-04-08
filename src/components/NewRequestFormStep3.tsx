import React from 'react';
import { Field as FormikField } from 'formik';
import * as Yup from 'yup';

export const schemaNewRequestFormStep3 = Yup.object().shape({
  noteToResident: Yup.string(),
});

const NewRequestFormStep3 = (): JSX.Element => {
  return (
    <>
      <h2 className="lbh-heading-h2">
        Would you like to add a note to this request?
      </h2>

      <div
        className="govuk-character-count"
        data-module="govuk-character-count"
        data-maxlength="400"
      >
        <div className="govuk-form-group lbh-form-group">
          <label className="govuk-label lbh-label" htmlFor="noteToResident">
            For example, you can add specific guidance for some of the
            documents, if needed.
          </label>
          <FormikField
            name="noteToResident"
            id="noteToResident"
            as="textarea"
            rows="3"
            data-testid="textarea"
            aria-describedby="more-detail-info"
            className="govuk-textarea govuk-js-character-count lbh-character-count"
          />
        </div>
        <span
          id="more-detail-info"
          className="govuk-hint govuk-character-count__message"
          aria-live="polite"
        >
          You can enter up to 400 characters
        </span>
      </div>
    </>
  );
};

export default NewRequestFormStep3;
