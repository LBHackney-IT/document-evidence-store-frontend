import React from 'react';
import { Field as FormikField } from 'formik';

const DateForm = (props: Props): JSX.Element => (
  <div
    className={`"govuk-form-group lbh-form-group ${
      props.error ? 'govuk-form-group--error' : null
    }`}
  >
    <span className="govuk-hint lbh-hint" id={`${props.name}-hint`}>
      For example, 31 3 1980
    </span>
    <div className={`"govuk-date-input lbh-date-input"`}>
      <div className={`"govuk-date-input__item"`}>
        <label className="govuk-label lbh-label" htmlFor="day">
          Day
        </label>
        <FormikField
          name={`${props.name}.[0]`}
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
          name={`${props.name}.[1]`}
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
        name={`${props.name}.[2]`}
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
  name: string;
  error?: string | null;
}

export default DateForm;
