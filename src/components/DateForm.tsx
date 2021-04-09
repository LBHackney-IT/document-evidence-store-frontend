import React from 'react';
import { Field as FormikField } from 'formik';

const DateForm = (props: Props): JSX.Element => (
  <div
    className={`"govuk-form-group lbh-form-group ${
      props.error ? 'govuk-form-group--error' : null
    }`}
  >
    <div className={`"govuk-date-input lbh-date-input"`}>
      <div className={`"govuk-date-input__item"`}>
        <label className="govuk-label lbh-label" htmlFor="day">
          Day
        </label>
        <FormikField
          name="validUntilArray.[0]"
          id="day"
          className="govuk-input govuk-date-input__input govuk-input--width-2"
          type="text"
          pattern="[0-9]*"
          inputmode="numeric"
        />
      </div>
      <div className={`"govuk-date-input__item"`}>
        <label className="govuk-label lbh-label" htmlFor="month">
          Month
        </label>
        <FormikField
          name="validUntilArray.[1]"
          //name={`${props.array}."month"`}
          id="month"
          className="govuk-input govuk-date-input__input govuk-input--width-2"
          type="text"
          pattern="[0-9]*"
          inputmode="numeric"
        />
      </div>
      <label className="govuk-label lbh-label" htmlFor="year">
        Year
      </label>
      <FormikField
        name="validUntilArray.[2]"
        //name={`${props.array}."year"`}
        id="year"
        className="govuk-input govuk-date-input__input govuk-input--width-2"
        type="text"
        pattern="[0-9]*"
        inputmode="numeric"
      />
    </div>
  </div>
);

export interface Props {
  //array: string[];
  //label: string;
  //name: string;
  textarea?: boolean;
  hint?: string;
  error?: string | null;
}

export default DateForm;
