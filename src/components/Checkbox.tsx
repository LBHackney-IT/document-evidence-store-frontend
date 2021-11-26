import React from 'react';
import { Field as FormikField } from 'formik';

const Field = (props: Props): JSX.Element => (
  <div className="govuk-checkboxes__item">
    <FormikField
      type="checkbox"
      name={props.name}
      id={props.id}
      value={props.value}
      disabled={props.disabled}
      className="govuk-checkboxes__input"
    />
    <label htmlFor={props.id} className="govuk-label govuk-checkboxes__label">
      {props.label}
    </label>
  </div>
);

export interface Props {
  label: string;
  name: string;
  id: string;
  value?: string;
  disabled?: boolean;
}

export default Field;
