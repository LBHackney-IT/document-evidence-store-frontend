import React from 'react';
import { Field as FormikField } from 'formik';

const Field = (props: Props): JSX.Element => (
  <div
    className={`"govuk-form-group lbh-form-group ${
      props.error ? 'govuk-form-group--error' : null
    }`}
  >
    <label className="govuk-label lbh-label" htmlFor={props.name}>
      {props.label}
    </label>
    {props.hint && (
      <span className="govuk-hint lbh-hint" id={`${props.name}-hint`}>
        {props.hint}
      </span>
    )}
    {props.error && (
      <span className="govuk-error-message lbh-error-message">
        <span className="govuk-visually-hidden">Error:</span> {props.error}
      </span>
    )}
    {props.textarea ? (
      <FormikField
        name={props.name}
        id={props.name}
        as="textarea"
        rows="3"
        data-testid="textarea"
        aria-describedby={props.hint ? `${props.name}-hint` : null}
        className={`govuk-textarea  lbh-textarea ${
          props.error ? 'govuk-input--error' : null
        }`}
      />
    ) : (
      <FormikField
        name={props.name}
        id={props.name}
        aria-describedby={props.hint ? `${props.name}-hint` : null}
        className={`govuk-input  lbh-input ${
          props.error ? 'govuk-input--error' : null
        }`}
      />
    )}
  </div>
);

export interface Props {
  label: string;
  name: string;
  textarea?: boolean;
  hint?: string;
  error?: string | null;
}

export default Field;
