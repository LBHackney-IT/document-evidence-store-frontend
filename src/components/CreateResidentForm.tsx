import React from 'react';
import Field from './Field';
import { useFormikContext, Formik } from 'formik';
import { CreateResidentRequest } from 'src/gateways/internal-api';
import * as Yup from 'yup';
import { Resident } from 'src/domain/resident';

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
  const { errors, touched } = useFormikContext<CreateResidentRequest>();

  return (
    <>
      <h1 className="lbh-heading-h2">Create A New Resident</h1>
      <Formik
        initialValues={{}}
        onSubmit={() => {
          props.createResident;
        }}
        validationScheme={schemaCreateResidentForm}
      >
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
        <button className="govuk-button lbh-button">Search</button>
      </Formik>
    </>
  );
};

interface Props {
  createResident(resident: CreateResidentRequest): Promise<Resident>;
}

export default CreateResidentForm;
