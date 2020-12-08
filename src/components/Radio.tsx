import React from 'react';
import { Field as FormikField } from 'formik';
import { Label } from 'lbh-frontend-react';

const Radio = (props: Props): JSX.Element => (
  <div className="govuk-radios__item">
    <FormikField
      type="radio"
      name={props.name}
      id={`${props.name}-${props.value}`}
      className="govuk-radios__input"
      value={props.value}
    />
    <Label
      labelFor={`${props.name}-${props.value}`}
      className="govuk-label govuk-radios__label"
    >
      {props.label}
    </Label>
  </div>
);

export interface Props {
  label: string;
  name: string;
  value: string;
}

export default Radio;
