import React from 'react';
import Checkbox from './Checkbox';
import { useFormikContext } from 'formik';
import { DocumentType } from '../domain/document-type';
import { EvidenceRequestForm } from 'src/gateways/internal-api';
import * as Yup from 'yup';

export const schemaNewRequestFormStep2 = Yup.object().shape({
  documentTypes: Yup.array().min(1, 'Please choose a document type'),
});

const NewRequestFormStep2 = ({ documentTypes }: Props): JSX.Element => {
  const { errors, touched } = useFormikContext<EvidenceRequestForm>();
  return (
    <>
      <div
        className={`govuk-form-group lbh-form-group ${
          touched.documentTypes &&
          errors.documentTypes &&
          'govuk-form-group--error'
        }`}
      >
        <fieldset className="govuk-fieldset">
          <legend className="govuk-fieldset__legend">
            What document do you want to request?
          </legend>
          {touched.documentTypes && errors.documentTypes && (
            <span className="govuk-error-message lbh-error-message">
              <span className="govuk-visually-hidden">Error:</span>{' '}
              {errors.documentTypes}
            </span>
          )}
          <div className="govuk-checkboxes lbh-checkboxes">
            {documentTypes.map((type) => (
              <Checkbox
                label={type.title}
                name="documentTypes"
                id={type.id}
                key={type.id}
                value={type.id}
              />
            ))}
          </div>
        </fieldset>
      </div>
    </>
  );
};

interface Props {
  documentTypes: Array<DocumentType>;
}

export default NewRequestFormStep2;
