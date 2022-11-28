import React, {
  FunctionComponent,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { Formik, Form, FormikTouched, FormikErrors } from 'formik';
import { StaffUploadFormModel } from '../services/staff-upload-form-model';
import { DocumentType } from '../domain/document-type';
import { LoadingBox } from 'govuk-react';
import PageWarning from 'src/components/PageWarning';
import StaffUploaderPanel from './StaffUploaderPanel';
import { Team } from 'src/domain/team';
import * as Yup from 'yup';

export type StaffUploadFormValues = {
  staffUploaderPanel: {
    staffSelectedDocumentType: string;
    description: string;
    files: File[];
  }[];
};

export const validationSchema = Yup.object().shape({
  staffUploaderPanel: Yup.array().of(
    Yup.object().shape({
      staffSelectedDocumentType: Yup.string(),
      description: Yup.string().required('Please enter a description'),
      files: Yup.mixed().required('Please select a file'),
    })
  ),
});

const initialValues: StaffUploadFormValues = {
  staffUploaderPanel: [
    {
      staffSelectedDocumentType: 'Select',
      description: '',
      files: [],
    },
  ],
};

export type UploaderPanelError = {
  staffSelectedDocumentType: string;
  description: string;
  files: File[];
};

const getError = (
  index: number,
  touched: FormikTouched<StaffUploadFormValues>,
  errors: FormikErrors<StaffUploadFormValues>
) => {
  const dirty = touched.staffUploaderPanel && touched.staffUploaderPanel[index];
  if (!dirty) return null;
  return errors.staffUploaderPanel &&
    errors.staffUploaderPanel[index] &&
    touched.staffUploaderPanel &&
    touched.staffUploaderPanel[index]
    ? ((errors.staffUploaderPanel[index] as unknown) as UploaderPanelError)
    : null;
};

const StaffUploaderForm: FunctionComponent<Props> = ({
  userEmail,
  residentId,
  team,
  staffSelectedDocumentTypes,
  onSuccess,
}) => {
  const [submitError, setSubmitError] = useState(false);
  const [submission, setSubmission] = useState(false);
  const [uploaderPanelsNumber, setUploaderPanelsNumber] = useState(1);
  const [uploaderPanels, setUploaderPanels] = useState([true]);
  const model = useMemo(
    () => new StaffUploadFormModel(staffSelectedDocumentTypes),
    [staffSelectedDocumentTypes]
  );

  const handleSubmit = useCallback(
    async (values) => {
      setSubmission(true);
      try {
        await model.handleSubmit(userEmail, residentId, team.name, values);
        onSuccess();
      } catch (err) {
        console.log(err);
        setSubmitError(true);
        setSubmission(false);
      }
    },
    [model, submitError]
  );

  const addPanel = useCallback(() => {
    setUploaderPanelsNumber(uploaderPanelsNumber + 1);
    const currentPanels = uploaderPanels;
    currentPanels.push(true);
    setUploaderPanels(currentPanels);
  }, [uploaderPanelsNumber]);

  const removePanel = useCallback(
    (panelIndex) => {
      setUploaderPanelsNumber(uploaderPanelsNumber - 1);
      const currentPanels = uploaderPanels;
      currentPanels[panelIndex] = false;
      setUploaderPanels(currentPanels);
    },
    [uploaderPanelsNumber, uploaderPanels]
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, setFieldValue }) => (
        <Form>
          {submitError && (
            <span className="govuk-error-message lbh-error-message">
              There was an error. Please try again later
            </span>
          )}
          {submission && (
            <PageWarning
              title="Your documents are being uploaded"
              content="Please do not close or refresh this page"
            />
          )}
          {uploaderPanels.map(
            (value: boolean, index: number) =>
              uploaderPanels[index] && (
                <StaffUploaderPanel
                  staffSelectedDocumentTypes={staffSelectedDocumentTypes}
                  setFieldValue={setFieldValue}
                  key={`staffUploaderPanel.${index}`}
                  name={`staffUploaderPanel.${index}`}
                  error={getError(index, touched, errors)}
                  removePanel={removePanel}
                  panelIndex={index}
                  formValues={values}
                />
              )
          )}
          {console.log('VALUES', values)}
          {console.log('ERRORS', errors)}
          <button
            type="button"
            onClick={() => {
              addPanel();
              values.staffUploaderPanel.push(
                initialValues.staffUploaderPanel[0]
              );
            }}
          >
            Add
          </button>
          <LoadingBox loading={submission}>
            <button
              className="govuk-button lbh-button"
              type="submit"
              //   disabled={!dirty || submission}
            >
              Submit
            </button>
          </LoadingBox>
        </Form>
      )}
    </Formik>
  );
};

interface Props {
  residentId: string;
  staffSelectedDocumentTypes: DocumentType[];
  team: Team;
  userEmail: string;
  onSuccess(): void;
}

export default StaffUploaderForm;
