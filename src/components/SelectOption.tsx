import React from 'react';
import { Field as FormikField } from 'formik';

const SelectOption = (props: Props): JSX.Element => (
  <>
    <label className="govuk-label lbh-label" htmlFor={props.name}>
      {props.label}
    </label>

    <FormikField
      name={props.name}
      id={props.name}
      as="select"
      className="govuk-select lbh-select"
    >
      {props.values.map((option) => (
        <option value={option} key={option}>
          {option}
        </option>
      ))}
    </FormikField>
  </>
);

export interface Props {
  label: string;
  name: string;
  values: string[];
}

export default SelectOption;
