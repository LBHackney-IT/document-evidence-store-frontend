import React, { FunctionComponent, useState } from 'react';
import Field from './Field';
import { Formik, Form, FormikState } from 'formik';
import { CreateResidentRequest } from 'src/gateways/internal-api';
import * as Yup from 'yup';
import styles from '../styles/CreateResidentForm.module.scss';
import LoadingSpinner from './LoadingSpinner';

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

const CreateResidentForm: FunctionComponent<Props> = ({
  createResident,
  initialValues,
}) => {
  const [submitError, setSubmitError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (resident: CreateResidentRequest) => {
    try {
      setIsLoading(true);
      setSubmitError(false);
      await createResident(resident);
    } catch (err) {
      setErrorMessage(String(err));
      setSubmitError(true);
      setIsLoading(false);
    }
  };

  const clearForm = (
    resetForm: (
      nextState?:
        | Partial<
            FormikState<{
              name: string;
              email: string;
              phoneNumber: string;
              groupId: string;
            }>
          >
        | undefined
    ) => void
  ) => {
    setIsLoading(false);
    setSubmitError(false);
    setErrorMessage('');
    resetForm();
  };

  return (
    <>
      <h1 className="lbh-heading-h2">Create Contact</h1>
      <div className="lbh-heading-h6">
        {initialValues.name
          ? `Please confirm the contact information in the text
        boxes below`
          : `Please enter the details for contact information in the
        text boxes below.`}
      </div>
      {submitError && (
        <span
          className={`govuk-error-message lbh-error-message ${styles.submitError}`}
        >
          {`Error: ${errorMessage}`}
        </span>
      )}
      <Formik
        initialValues={{
          name: initialValues.name ? initialValues.name : '',
          email: initialValues.email ? initialValues.email : '',
          phoneNumber: initialValues.phone ? initialValues.phone : '',
          groupId: initialValues.groupId ? initialValues.groupId : null,
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
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <button className="govuk-button lbh-button" type="submit">
                    Create
                  </button>

                  <button
                    className={`govuk-button govuk-secondary lbh-button lbh-button--secondary ${styles.cancelButton}`}
                    type="button"
                    onClick={() => {
                      clearForm(resetForm);
                    }}
                  >
                    Clear
                  </button>
                </>
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

interface Props {
  createResident(resident: CreateResidentRequest): Promise<void>;
  initialValues: {
    name: string | null;
    email: string | null;
    phone: string | null;
    groupId: string | null;
  };
}

export default CreateResidentForm;
