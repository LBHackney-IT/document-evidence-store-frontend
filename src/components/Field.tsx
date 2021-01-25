import React from 'react';
import { Field as FormikField } from 'formik';
import { Label, Hint, ErrorMessage } from 'lbh-frontend-react';

const Field = (props: Props): JSX.Element => (
  <div
    className={`"govuk-form-group lbh-form-group ${
      props.error ? 'govuk-form-group--error' : null
    }`}
  >
    <Label labelFor={props.name}>{props.label}</Label>
    {props.hint && <Hint id={`${props.name}-hint`}>{props.hint}</Hint>}
    {props.error && <ErrorMessage>{props.error}</ErrorMessage>}
    {props.textarea ? (
      <FormikField
        name={props.name}
        id={props.name}
        as="textarea"
        rows="3"
        data-testid="textarea"
        aria-describedby={props.hint ? `${props.name}-hint` : false}
        className={`govuk-textarea  lbh-textarea ${
          props.error ? 'govuk-input--error' : null
        }`}
      />
    ) : (
      <FormikField
        name={props.name}
        id={props.name}
        aria-describedby={props.hint ? `${props.name}-hint` : false}
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
