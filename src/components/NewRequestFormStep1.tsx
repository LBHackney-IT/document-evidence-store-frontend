import React from 'react';
import Field from './Field';
import Checkbox from './Checkbox';
import { useFormikContext } from 'formik';
import { EvidenceRequestForm } from 'src/gateways/internal-api';
import SelectOption from './SelectOption';
import { Team } from '../domain/team';
import * as Yup from 'yup';

const emailOrPhoneNumberMessage =
  'Please provide either an email or a phone number';
const atLeastOneDeliveryMethodMessage =
  'Please provide at least one delivery method';

export const schemaNewRequestFormStep1 = Yup.object().shape(
  {
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
    emailCheckbox: Yup.array().when(
      ['phoneNumberCheckbox', 'uploadLinkCheckbox'],
      {
        is: (phoneNumberCheckbox, uploadLinkCheckbox) =>
          phoneNumberCheckbox &&
          !phoneNumberCheckbox[0] &&
          !uploadLinkCheckbox[0],
        then: Yup.array().min(1, atLeastOneDeliveryMethodMessage),
      }
    ),
    phoneNumberCheckbox: Yup.array().when(
      ['emailCheckbox', 'uploadLinkCheckbox'],
      {
        is: (emailCheckbox, uploadLinkCheckbox) =>
          emailCheckbox && !emailCheckbox[0] && !uploadLinkCheckbox[0],
        then: Yup.array().min(1, atLeastOneDeliveryMethodMessage),
      }
    ),
    deliveryMethods: Yup.array(),
  },
  [['emailCheckbox', 'phoneNumberCheckbox']]
);

const NewRequestFormStep1 = ({ team }: Props): JSX.Element => {
  const { errors, values, touched } = useFormikContext<EvidenceRequestForm>();

  return (
    <>
      <h1 className="lbh-heading-h2">Make a new request</h1>

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
          touched.resident?.phoneNumber ? errors.resident?.phoneNumber : null
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
            error={
              touched.emailCheckbox && values.resident.email
                ? errors.emailCheckbox
                : null
            }
          />
          <Checkbox
            label="Send request by SMS"
            name="phoneNumberCheckbox"
            id="phoneNumberCheckbox"
            value={values.resident?.phoneNumber}
            disabled={values.resident?.phoneNumber ? false : true}
            error={
              touched.phoneNumberCheckbox && values.resident?.phoneNumber
                ? errors.phoneNumberCheckbox
                : null
            }
          />
          <Checkbox
            label="View request upload link"
            name="uploadLinkCheckbox"
            id="uploadLinkCheckbox"
            value={'true'}
          />
        </div>
      </div>
    </>
  );
};

interface Props {
  team: Team;
}

export default NewRequestFormStep1;
