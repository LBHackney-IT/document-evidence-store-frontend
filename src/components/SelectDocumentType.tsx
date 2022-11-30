import React from 'react';
import { Field as FormikField, useFormikContext } from 'formik';
import { StaffUploadFormValues } from './StaffUploaderForm';
import { getIn } from 'formik';

const SelectDocumentType = (props: Props): JSX.Element => {
  const { errors, touched } = useFormikContext<StaffUploadFormValues>();
  return (
    <>
      <label className="govuk-label lbh-label" htmlFor={props.name}>
        {props.label}
      </label>

      {touched.staffUploaderPanel &&
        getIn(
          touched.staffUploaderPanel[props.panelIndex],
          'staffSelectedDocumentType'
        ) &&
        errors.staffUploaderPanel &&
        getIn(
          errors.staffUploaderPanel[props.panelIndex],
          'staffSelectedDocumentType'
        ) && (
          <span className="govuk-error-message lbh-error-message">
            <span className="govuk-visually-hidden">Error:</span>{' '}
            {getIn(
              errors.staffUploaderPanel[props.panelIndex],
              'staffSelectedDocumentType'
            )}
          </span>
        )}

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
};

export interface Props {
  label: string;
  name: string;
  values: string[];
  panelIndex: number;
}

export default SelectDocumentType;
