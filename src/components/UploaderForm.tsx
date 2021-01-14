import React, {
  FunctionComponent,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { Button, ErrorMessage } from 'lbh-frontend-react';
import { Formik, Form, FormikTouched, FormikErrors } from 'formik';
import * as Yup from 'yup';
import UploaderPanel from './UploaderPanel';
import { DocumentSubmission } from 'src/domain/document-submission';

type FormValues = {
  [key: string]: File;
};

const getError = (
  id: string,
  touched: FormikTouched<File>,
  errors: FormikErrors<File>
) => {
  const dirty = touched[id as keyof typeof touched];
  if (!dirty) return null;
  return errors[id as keyof typeof errors] as string;
};

const UploaderForm: FunctionComponent<Props> = ({ submissions }) => {
  const [submitError, setSubmitError] = useState(false);

  const schema = useMemo(
    () =>
      Yup.object(
        submissions.reduce(
          (others, key) => ({
            ...others,
            [key.id]: Yup.mixed().required('Please select a file'),
          }),
          {}
        )
      ),
    [submissions]
  );

  const initialValues: FormValues = useMemo(
    () =>
      submissions.reduce(
        (others, key) => ({
          ...others,
          [key.id]: null,
        }),
        {}
      ),
    [submissions]
  );

  const handleSubmit = useCallback(async (values) => {
    try {
      console.log(values);
    } catch (err) {
      console.log(err);
      setSubmitError(true);
    }
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, setFieldValue, isSubmitting }) => (
        <Form>
          {submitError && (
            <ErrorMessage>
              There was an error. Please try again later
            </ErrorMessage>
          )}

          {submissions.map(({ id, documentType }) => (
            <UploaderPanel
              setFieldValue={setFieldValue}
              key={id}
              label={documentType.title}
              hint={documentType.description}
              name={id}
              set={!!values[id as keyof typeof values]}
              error={getError(id, touched, errors)}
            />
          ))}

          <Button type="submit" disabled={isSubmitting}>
            Continue
          </Button>
        </Form>
      )}
    </Formik>
  );
};

interface Props {
  submissions: DocumentSubmission[];
  requestId: string;
}

export default UploaderForm;
