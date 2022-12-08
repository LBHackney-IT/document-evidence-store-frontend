import React from 'react';
import Field from './Field';
import { Formik, Form } from 'formik';
import { CreateResidentRequest } from 'src/gateways/internal-api';
import * as Yup from 'yup';

export const emailOrPhoneNumberMessage =
  'Please provide either an email or a phone number';

export const schemaCreateResidentForm = Yup.object().shape({
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
});

const CreateResidentForm = (props: Props): JSX.Element => {
  return (
    <>
      <h1 className="lbh-heading-h2">Create A New Resident</h1>
      <Formik
        initialValues={{
          name: '',
          email: '',
          phoneNumber: '',
        }}
        onSubmit={(values: CreateResidentRequest) => {
          console.log('calling onSubmit with these values: ' + values);
          props.createResident(values);
        }}
        validationScheme={schemaCreateResidentForm}
      >
        {({ errors, touched }) => (
          <>
            <Form>
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
                name="phoneNumber"
                error={touched.phoneNumber ? errors.phoneNumber : null}
              />
              <button className="govuk-button lbh-button" type="submit">
                Create
              </button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

interface Props {
  createResident(resident: CreateResidentRequest): void;
}

export default CreateResidentForm;
