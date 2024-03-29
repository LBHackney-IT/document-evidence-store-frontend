import React from 'react';
import * as Yup from 'yup';
import { TextAreaWithCharacterCount } from './TextAreaWithCharacterCount';

const maxCharacterLength = 5000;

export const schemaNewRequestFormStep3 = Yup.object().shape({
  noteToResident: Yup.string().max(maxCharacterLength),
});

const NewRequestFormStep3 = (): JSX.Element => {
  return (
    <>
      <h2 className="lbh-heading-h2">
        Would you like to add a note to this request?
      </h2>
      <div className="govuk-form-group lbh-form-group">
        <label className="govuk-label lbh-label" htmlFor="noteToResident">
          For example, you can add specific guidance for some of the documents,
          if needed.
        </label>
        <TextAreaWithCharacterCount
          name="noteToResident"
          id="noteToResident"
          dataTestId="textarea"
          maxCharacterLength={maxCharacterLength}
          rows={5}
        />
      </div>
    </>
  );
};

export default NewRequestFormStep3;
