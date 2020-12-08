import React from 'react';
import { Field as FormikField } from 'formik';
import { Label } from 'lbh-frontend-react';

const Field = (props: Props): JSX.Element => (
  <div className="govuk-checkboxes__item">
    <FormikField
      type="checkbox"
      name={props.name}
      id={props.name}
      className="govuk-checkboxes__input"
    />
    <Label
      labelFor={props.name}
      className="govuk-label govuk-checkboxes__label"
    >
      {props.label}
    </Label>
  </div>
);

export interface Props {
  label: string;
  name: string;
}

export default Field;
