import React from 'react';
import { Field as FormikField } from 'formik';
import { Label } from 'lbh-frontend-react';

const SelectOption = (props: Props): JSX.Element => (
  <div className="govuk-select">
    <Label labelFor={props.name}>{props.label}</Label>

    <FormikField
      name={props.name}
      id={props.name}
      as="select"
      className="govuk-select  lbh-select__label"
    >
      {props.values.map((option) => (
        <option
          className="govuk-select  lbh-select__option"
          value={option}
          key={option}
        >
          {option}
        </option>
      ))}
    </FormikField>
  </div>
);

export interface Props {
  label: string;
  name: string;
  values: string[];
}

export default SelectOption;
