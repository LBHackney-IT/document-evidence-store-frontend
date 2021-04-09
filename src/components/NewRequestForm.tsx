import React, { useCallback, useState } from 'react';
import Field from './Field';
import Checkbox from './Checkbox';
import Radio from './Radio';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { DocumentType } from '../domain/document-type';
import { EvidenceRequestRequest } from 'src/gateways/internal-api';
import ConfirmRequestDialog from './ConfirmRequestDialog';
import SelectOption from './SelectOption';
import { Team } from '../domain/team';

const schema = Yup.object().shape({
  resident: Yup.object().shape(
    {
      name: Yup.string().required("Please enter the resident's name"),
      email: Yup.string().when(['phoneNumber'], {
        is: (phoneNumber) => !phoneNumber,
        then: Yup.string()
          .required('Please provide either an email or a phone number')
          .email('Please give a valid email address'),
      }),
      phoneNumber: Yup.string().when(['email'], {
        is: (email) => !email,
        then: Yup.string().required(
          'Please provide either an email or a phone number'
        ),
      }),
    },
    [['email', 'phoneNumber']]
  ),
  serviceRequestedBy: Yup.string(),
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

  const initialValues = {
    resident: {
      name: '',
      email: '',
      phoneNumber: '',
    },
    serviceRequestedBy: team.name,
    reason: team.reasons[0].name,
    documentTypes: [],
    deliveryMethods: ['SMS', 'EMAIL'],
  };

  const submitHandler = useCallback(
    async (values: typeof initialValues) => {
      if (!request) return setRequest(values);
      try {
        await onSubmit(values);
        setRequest(undefined);
      } catch (err) {
        setRequest(undefined);
        setSubmitError(true);
      }
    },
    [setRequest, request, onSubmit, setSubmitError]
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={submitHandler}
    >
      {({ values, errors, touched, isSubmitting, submitForm }) => (
        <Form>
          {submitError && (
            <span className="govuk-error-message lbh-error-message">
              There was an error. Please try again later.
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
                name="deliveryMethods"
                value={values.resident?.email}
                disabled={values.resident?.email ? false : true}
                //checked={!errors.resident?.email}
              />
              <Checkbox
                label="Send request by SMS"
                name="deliveryMethods"
                value={values.resident?.phoneNumber}
                disabled={values.resident?.phoneNumber ? false : true}
                // checked={values.resident?.phoneNumber ? true : false}
              />
            </div>
          </div>

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
              <div className="govuk-radios lbh-radios">
                {documentTypes.map((type) => (
                  <Radio
                    label={type.title}
                    key={type.id}
                    value={type.id}
                    name="documentTypes[0]"
                  />
                ))}
              </div>
            </fieldset>
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

export default NewRequestForm;
