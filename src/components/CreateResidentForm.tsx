import React from 'react';
import Field from './Field';
import { useFormikContext } from 'formik';
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

const CreateResidentForm = (): JSX.Element => {
  const { errors, touched } = useFormikContext<CreateResidentRequest>(); //create resident request //replace values

  return (
    <>
      <h1 className="lbh-heading-h2">Create A New Resident</h1>

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
    </>
  );
};

export default CreateResidentForm;
