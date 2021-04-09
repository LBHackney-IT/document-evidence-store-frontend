import React from 'react';
import { Field as FormikField } from 'formik';

const DateField = (props: Props): JSX.Element => (
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
    <FormikField
      name={props.name}
      id={props.name}
      aria-describedby={props.hint ? `${props.name}-hint` : false}
      className={`govuk-date-input  lbh-date-input ${
        props.error ? 'govuk-input--error' : null
      }`}
    />
  </div>
);

export interface Props {
  label: string;
  name: string;
  textarea?: boolean;
  hint?: string;
  error?: string | null;
}

export default DateField;
