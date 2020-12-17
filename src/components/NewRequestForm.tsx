import { useState } from 'react';
import { Button, ErrorMessage } from 'lbh-frontend-react';
import Field from './Field';
import Checkbox from './Checkbox';
import Radio from './Radio';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { DocumentType } from '../domain/document-type';
import { EvidenceRequestRequest } from 'src/gateways/internal-api';

const schema = Yup.object().shape({
  resident: Yup.object().shape({
    name: Yup.string().required("Please enter the resident's name"),
    email: Yup.string()
      .required("Please enter the resident's email address")
      .email('Please give a valid email address'),
    phoneNumber: Yup.string().required(
      "Please enter the resident's phone number"
    ),
  }),
  deliveryMethods: Yup.array(),
  documentTypes: Yup.string().required('Please choose a document type'),
});

const NewRequestForm = ({ documentTypes, onSubmit }: Props): JSX.Element => {
  const [submitError, setSubmitError] = useState(false);

  return (
    <Formik
      initialValues={{
        resident: {
          name: '',
          email: '',
          phoneNumber: '',
        },
        documentTypes: '',
        deliveryMethods: ['SMS', 'EMAIL'],
      }}
      validationSchema={schema}
      onSubmit={async (values) => {
        console.log(values);
        try {
          await onSubmit({
            ...values,
            // TODO: Remove this when we support multiple document types
            documentTypes: [values.documentTypes],
          });
        } catch (err) {
          setSubmitError(true);
        }
      }}
    >
      {({ errors, touched }) => (
        <Form>
          {submitError && (
            <ErrorMessage>
              There was an error. Please try again later
            </ErrorMessage>
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
            <div className="govuk-checkboxes lbh-checkboxes">
              <Checkbox
                label="Send request by email"
                name="deliveryMethods"
                value="EMAIL"
              />
              <Checkbox
                label="Send request by SMS"
                name="deliveryMethods"
                value="SMS"
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
                <ErrorMessage>{errors.documentTypes}</ErrorMessage>
              )}
              <div className="govuk-radios lbh-radios">
                {documentTypes.map((type) => (
                  <Radio
                    label={type.title}
                    key={type.id}
                    value={type.id}
                    name="documentTypes"
                  />
                ))}
              </div>
            </fieldset>
          </div>

          <Button type="submit">Send request</Button>
        </Form>
      )}
    </Formik>
  );
};

interface Props {
  documentTypes: Array<DocumentType>;
  onSubmit: (values: EvidenceRequestRequest) => Promise<void>;
}

export default NewRequestForm;
