import React from 'react';
import { Field as FormikField, useFormikContext } from 'formik';
import { StaffUploadFormValues } from './StaffUploaderForm';
import { getIn } from 'formik';

const DocumentDescription = (props: Props): JSX.Element => {
  const { errors, touched } = useFormikContext<StaffUploadFormValues>();
  return (
    <div className={'govuk-form-group lbh-form-group'}>
      <label className="govuk-label lbh-label" htmlFor={props.name}>
        {props.label}
      </label>
      {props.hint && (
        <span className="govuk-hint lbh-hint" id={`${props.name}-hint`}>
          {props.hint}
        </span>
      )}
      {errors.staffUploaderPanel &&
        touched.staffUploaderPanel &&
        getIn(touched.staffUploaderPanel[props.panelIndex], 'description') &&
        getIn(errors.staffUploaderPanel[props.panelIndex], 'description') && (
          <span className="govuk-error-message lbh-error-message">
            <span className="govuk-visually-hidden">Error:</span>{' '}
            {getIn(errors.staffUploaderPanel[props.panelIndex], 'description')}
          </span>
        )}

      <FormikField
        name={props.name}
        id={props.name}
        aria-describedby={props.hint ? `${props.name}-hint` : null}
        data-testid={`document-description-${props.panelIndex}`}
        className={`govuk-input  lbh-input ${
          errors.staffUploaderPanel &&
          touched.staffUploaderPanel &&
          getIn(touched.staffUploaderPanel[props.panelIndex], 'description') &&
          getIn(errors.staffUploaderPanel[props.panelIndex], 'description')
            ? 'govuk-input--error'
            : null
        }`}
        style={props.style}
      />
    </div>
  );
};

export interface Props {
  label: string;
  name: string;
  textarea?: boolean;
  hint?: string;
  style?: { marginTop: string };
  panelIndex: number;
}

export default DocumentDescription;
