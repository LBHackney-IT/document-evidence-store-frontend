import React, {
  FunctionComponent,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { Formik, Form } from 'formik';
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
      staffSelectedDocumentType: Yup.string().test(
        'select-a-value',
        'Please select a document type',
        (value) => {
          return value !== 'Please select';
        }
      ),
      description: Yup.string()
        .max(255, 'Description must be less than 255 characters')
        .test('must-have-description', 'Please add a description', (value) => {
          return value ? value.length > 0 : false;
        }),
      files: Yup.mixed().test(
        'at-least-one-file',
        'Please select a file',
        (value) => {
          return value && value.length > 0;
        }
      ),
    })
  ),
});

const createInitialPanelValues = () => ({
  staffSelectedDocumentType: 'Please select',
  description: '',
  files: [],
});

const initialValues: StaffUploadFormValues = {
  staffUploaderPanel: [createInitialPanelValues()],
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
      {({ values, setFieldValue }) => (
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
                  removePanel={removePanel}
                  panelIndex={index}
                />
              )
          )}
          <button
            type="button"
            onClick={() => {
              addPanel();
              values.staffUploaderPanel.push(createInitialPanelValues());
            }}
          >
            Add
          </button>
          <LoadingBox loading={submission}>
            <button className="govuk-button lbh-button" type="submit">
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
