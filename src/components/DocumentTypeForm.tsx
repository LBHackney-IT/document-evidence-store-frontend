import React, { useCallback, useState } from 'react';
import Field from './Field';
import Checkbox from './Checkbox';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { DocumentType } from '../domain/document-type';
import {
  EvidenceRequestRequest,
  EvidenceRequestForm,
} from 'src/gateways/internal-api';
import ConfirmRequestDialog from './ConfirmRequestDialog';
import SelectOption from './SelectOption';
import { Team } from '../domain/team';

const emailOrPhoneNumberMessage =
  'Please provide either an email or a phone number';

const schema = Yup.object().shape({
  documentTypes: Yup.array().min(1, 'Please choose a document type'),
});

const DocumentsRequestForm = ({
  documentTypes,
  team,
  onSubmit,
}: Props): JSX.Element => {
  const [submitError, setSubmitError] = useState(false);
  const [request, setRequest] = useState<EvidenceRequestRequest>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const initialValues = {
    resident: {
      name: '',
      email: '',
      phoneNumber: '',
    },
    team: team.name,
    reason: team.reasons[0].name,
    documentTypes: [],
    emailCheckbox: '',
    phoneNumberCheckbox: '',
  };

  const submitHandler = useCallback(
    async (values) => {
      const payload = buildEvidenceRequestRequest(values);
      if (!request) return setRequest(payload);
      try {
        await onSubmit(payload);
        setRequest(undefined);
      } catch (err) {
        setRequest(undefined);
        setSubmitError(true);
        if (err instanceof Error) {
          setErrorMessage(err.message);
        }
        setErrorMessage('An issue has occurred');
      }
    },
    [setRequest, request, onSubmit, setSubmitError, setErrorMessage]
  );

  const buildEvidenceRequestRequest = (values: EvidenceRequestForm) => {
    const deliveryMethods: string[] = [];
    if (values.emailCheckbox.length !== 0 && values.resident.email !== '') {
      deliveryMethods.push('EMAIL');
    }

    if (
      values.phoneNumberCheckbox.length !== 0 &&
      values.resident.phoneNumber !== ''
    ) {
      deliveryMethods.push('SMS');
    }
    const payload: EvidenceRequestRequest = {
      ...values,
      deliveryMethods: deliveryMethods,
    };

    return payload;
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={submitHandler}
    >
      {({ values, errors, touched, isSubmitting, submitForm }) => (
        <Form>

         <div
            className={`govuk-form-group lbh-form-group ${
              touched.documentTypes &&
              errors.documentTypes &&
              'govuk-form-group--error'
            }`}
          >
            <div className="govuk-fieldset">
              <legend className="govuk-fieldset__legend">
                What document do you want to request?
              </legend>
              {touched.documentTypes && errors.documentTypes && (
                <span className="govuk-error-message lbh-error-message">
                  <span className="govuk-visually-hidden">Error:</span>{' '}
                  {errors.documentTypes}
                </span>
              )}
              </div>
              <div className="govuk-checkboxes lbh-checkboxes">
                {documentTypes.map((type) => (
                  <Checkbox
                    label={type.title}
                    key={type.id+documentTypes}
                    name= {type.id + "documentTypes"}
                    value={type.id}
                  />
                ))}
              </div>
            
          </div>

          <button
            className="govuk-button lbh-button"
            type="submit"
            disabled={isSubmitting}
           
          >
            Send request
          </button>

          <ConfirmRequestDialog
            documentTypes={documentTypes}
            request={request}
            onAccept={submitForm}
            onDismiss={() => setRequest(undefined)}
          />
        </Form>
      )}
    </Formik>
  );
};

interface Props {
  documentTypes: Array<DocumentType>;
  team: Team;
  onSubmit: (values: EvidenceRequestRequest) => Promise<void>;
}

export default DocumentsRequestForm;
