import React, { FunctionComponent, useState } from 'react';
import Field from './Field';
import { Formik, Form } from 'formik';
import { CreateResidentRequest } from 'src/gateways/internal-api';
import * as Yup from 'yup';
import styles from '../styles/CreateResidentForm.module.css';

export const emailOrPhoneNumberMessage =
  'Please provide either an email or a phone number';

export const createResidentSchema = Yup.object().shape(
  {
    name: Yup.string().required("Please enter the resident's name"),
    email: Yup.string().when('phoneNumber', {
      is: (phoneNumber) => !phoneNumber,
      then: Yup.string()
        .required(emailOrPhoneNumberMessage)
        .email('Please provide a valid email address'),
    }),
    phoneNumber: Yup.string().when('email', {
      is: (email) => !email,
      then: Yup.string()
        .required(emailOrPhoneNumberMessage)
        .matches(/^\+?[\d]{6,14}$/, 'Please provide a valid phone number'),
    }),
  },
  [['email', 'phoneNumber']]
);

const CreateResidentForm: FunctionComponent<Props> = ({ createResident }) => {
  const [submitError, setSubmitError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (resident: CreateResidentRequest) => {
    try {
      setSubmitError(false);
      createResident(resident);
    } catch (err) {
      setErrorMessage(String(err));
      setSubmitError(true);
    }
  };

  return (
    <>
      <h1 className="lbh-heading-h2">Create Contact</h1>
      <div className="lbh-heading-h6">
        Please enter the details for contact information in the text boxes
        below.
      </div>
      {submitError && (
        <span className="govuk-error-message lbh-error-message">
          {errorMessage}
        </span>
      )}
      <Formik
        initialValues={{
          name: '',
          email: '',
          phoneNumber: '',
        }}
        onSubmit={handleSubmit}
        validationSchema={createResidentSchema}
      >
        {({ errors, touched, resetForm }) => (
          <>
            <Form>
              <Field
                label="Name"
                name="name"
                error={touched.name ? errors.name : null}
              />
              <Field
                label="Email Address"
                name="email"
                error={touched.email ? errors.email : null}
              />
              <Field
                label="Phone Number"
                name="phoneNumber"
                error={touched.phoneNumber ? errors.phoneNumber : null}
              />
              <button className="govuk-button lbh-button" type="submit">
                Create
              </button>
              <button
                className={`govuk-button govuk-secondary lbh-button lbh-button--secondary ${styles.cancelButton}`}
                onClick={() => resetForm()}
              >
                Clear
              </button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

interface Props {
  createResident(resident: CreateResidentRequest): Promise<void>;
}

export default CreateResidentForm;
