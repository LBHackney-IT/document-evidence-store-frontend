import React, { FunctionComponent, useCallback, useState } from 'react';
import Field from './Field';
import { Formik, Form } from 'formik';
import {
  CreateResidentRequest,
  InternalApiGateway,
} from 'src/gateways/internal-api';
import * as Yup from 'yup';
import { Resident } from 'src/domain/resident';
import { Constants } from 'src/helpers/Constants';

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

const CreateResidentForm: FunctionComponent<Props> = ({ onSuccess }) => {
  const [submitError, setSubmitError] = useState(false);

  const handleSubmit = useCallback(
    async (resident: CreateResidentRequest) => {
      const gateway = new InternalApiGateway();

      try {
        const newResident = await gateway.createResident(
          Constants.DUMMY_EMAIL,
          resident
        );

        onSuccess(newResident);
      } catch (err) {
        console.log(err);
        setSubmitError(true);
      }
    },
    [submitError]
  );

  return (
    <>
      <h1 className="lbh-heading-h1">Create Contact</h1>
      <div className="lbh-heading-h6">
        Please enter the details for contact information in the text boxes
        below.
      </div>
      <Formik
        initialValues={{
          name: '',
          email: '',
          phoneNumber: '',
        }}
        onSubmit={handleSubmit}
        validationSchema={createResidentSchema}
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
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

interface Props {
  onSuccess(resident: Resident): void;
}

export default CreateResidentForm;
