import React from 'react';
import { Field as FormikField } from 'formik';

const Field = (props: Props): JSX.Element => (
  <div className="govuk-checkboxes__item">
    <FormikField
      type="checkbox"
      name={props.name}
      id={props.name}
      value={props.value}
      className="govuk-checkboxes__input"
    />
    <label htmlFor={props.name} className="govuk-label govuk-checkboxes__label">
      {props.label}
    </label>
  </div>
);

export interface Props {
  label: string;
  name: string;
  value?: string;
}

export default Field;
