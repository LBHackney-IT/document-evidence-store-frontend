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
  resident: Yup.object().shape(
    {
      name: Yup.string().required("Please enter the resident's name"),
      email: Yup.string().when(['phoneNumber'], {
        is: (phoneNumber) => !phoneNumber,
        then: Yup.string()
          .required(emailOrPhoneNumberMessage)
          .email('Please provide a valid email address'),
      }),
      phoneNumber: Yup.string().when(['email'], {
        is: (email) => !email,
        then: Yup.string()
          .required(emailOrPhoneNumberMessage)
          .matches(/^\+?[\d]{6,14}$/, 'Please provide a valid phone number'),
      }),
    },
    [['email', 'phoneNumber']]
  ),
  team: Yup.string(),
  reason: Yup.string(),
  deliveryMethods: Yup.array(),
  documentTypes: Yup.array().min(1, 'Please choose a document type'),
});

const NewRequestForm = ({
  documentTypes,
  team,
  onSubmit,
}: Props): JSX.Element => {
  const [submitError, setSubmitError] = useState(false);
  const [request, setRequest] = useState<EvidenceRequestRequest>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [complete, setComplete] = useState(false);

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
        setErrorMessage(err);
        setComplete(true);
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
      initialValues={initialValues} //[teamId]/dashboard/requests/create/step/[id]
      validationSchema={schema}
      onSubmit={submitHandler}
    >
      {({ values, errors, touched, isSubmitting, submitForm }) => (
        <Form>
          <div className={complete ? 'govuk-visually-hidden' : ''}>
            <h1 className="lbh-heading-h2">Make a new request</h1>
            {submitError && (
              <span className="govuk-error-message lbh-error-message">
                {errorMessage}
              </span>
            )}

            <Field
              label="Name"
              name="resident.name"
              error={touched.resident?.name ? errors.resident?.name : null}
            />
            <Field
              label="Email"
              name="resident.email"
              error={touched.resident?.email ? errors.resident?.email : null}
            />
            <Field
              label="Mobile phone number"
              name="resident.phoneNumber"
              error={
                touched.resident?.phoneNumber
                  ? errors.resident?.phoneNumber
                  : null
              }
            />

            <div className="govuk-form-group lbh-form-group">
              <SelectOption
                label="What is this request for?"
                name="reason"
                values={team.reasons.map((reason) => reason.name)}
              />
            </div>

            <div className="govuk-form-group lbh-form-group">
              <div className="govuk-checkboxes lbh-checkboxes">
                <Checkbox
                  label="Send request by email"
                  name="emailCheckbox"
                  id="emailCheckbox"
                  value={values.resident?.email}
                  disabled={values.resident?.email ? false : true}
                />
                <Checkbox
                  label="Send request by SMS"
                  name="phoneNumberCheckbox"
                  id="phoneNumberCheckbox"
                  value={values.resident?.phoneNumber}
                  disabled={values.resident?.phoneNumber ? false : true}
                />
                {console.log(
                  `Resident name error: ${errors.resident?.name?.toString()}`
                )}
                {console.log(
                  `Resident email error: ${errors.resident?.email?.toString()}`
                )}
                {console.log(
                  `Document types error: ${errors.documentTypes?.toString()}`
                )}
              </div>
            </div>

            <button
              className="govuk-button lbh-button"
              type="submit"
              onClick={() => {
                touched.resident && !errors.resident && setComplete(true);
              }}
              disabled={isSubmitting}
            >
              Continue
            </button>
          </div>

          {complete && (
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

              <button
                className="govuk-button lbh-button"
                type="submit"
                disabled={isSubmitting}
              >
                Send request
              </button>
            </div>
          )}

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

export default NewRequestForm;
