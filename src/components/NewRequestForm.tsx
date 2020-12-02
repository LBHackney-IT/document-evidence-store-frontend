import { useState } from 'react';
import { Button, ErrorMessage } from 'lbh-frontend-react';
import Layout from './DashboardLayout';
import Field from './Field';
import Checkbox from './Checkbox';
import Radio from './Radio';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import fetch from 'isomorphic-unfetch';

const schema = Yup.object().shape({
  name: Yup.string().required("Please enter the resident's name"),
  email: Yup.string()
    .required("Please enter the resident's email address")
    .email('Please give a valid email address'),
  phone: Yup.string().required("Please enter the resident's phone number"),
  sendByEmail: Yup.boolean(),
  sendBySms: Yup.boolean(),
  evidence: Yup.string().required('Please choose an evidence type'),
});

const NewRequestForm = (props: Props): JSX.Element => {
  const [submitError, setSubmitError] = useState(false);

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        phone: '',
        evidence: '',
        sendByEmail: true,
        sendBySms: true,
      }}
      validationSchema={schema}
      onSubmit={async (values) => {
        try {
          console.log(values);
          // process form here
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
            name="name"
            error={touched.name ? errors.name : null}
          />
          <Field
            label="Email"
            name="email"
            error={touched.email ? errors.email : null}
          />
          <Field
            label="Mobile phone number"
            name="phone"
            error={touched.phone ? errors.phone : null}
          />

          <div className="govuk-form-group lbh-form-group">
            <div className="govuk-checkboxes lbh-checkboxes">
              <Checkbox label="Send request by email" name="sendByEmail" />
              <Checkbox label="Send request by SMS" name="sendBySms" />
            </div>
          </div>

          <div
            className={`govuk-form-group lbh-form-group ${
              touched.evidence && errors.evidence && 'govuk-form-group--error'
            }`}
          >
            <fieldset className="govuk-fieldset">
              <legend className="govuk-fieldset__legend">
                What document do you want to request?
              </legend>
              {touched.evidence && errors.evidence && (
                <ErrorMessage>{errors.evidence}</ErrorMessage>
              )}
              <div className="govuk-radios  lbh-radios">
                {props.evidenceTypes.map((type) => (
                  <Radio
                    label={type.title}
                    key={type.id}
                    value={type.id}
                    name="evidence"
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
  evidenceTypes: Array<EvidenceType>;
}

interface EvidenceType {
  id: string;
  title: string;
}

export default NewRequestForm;
