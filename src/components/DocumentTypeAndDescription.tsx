import { FunctionComponent } from 'react';
import SelectOption from './SelectOption';
import { DocumentType } from '../domain/document-type';
import Field from './Field';
import { UploaderPanelError } from './StaffUploaderForm';
import documentStyles from '../styles/DocumentTypeAndDescription.module.scss';

const DocumentTypeAndDescription: FunctionComponent<Props> = ({
  name,
  documentTypes,
  error,
}) => {
  return (
    <div
      className={`govuk-form-group lbh-form-group ${documentStyles.formWrapper}`}
    >
      <div className={documentStyles.documentOptions}>
        <SelectOption
          name={`${name}.staffSelectedDocumentType`}
          label="Document type"
          values={['Please select', ...documentTypes.map((dt) => dt.title)]}
        />
      </div>
      <div className={documentStyles.documentDescription}>
        <Field
          label="Description"
          name={`${name}.description`}
          style={{ marginTop: '4px' }}
          error={error ? error.description : null}
        />
      </div>
    </div>
  );
};

interface Props {
  name: string;
  documentTypes: DocumentType[];
  error: UploaderPanelError | null | undefined;
}

export default DocumentTypeAndDescription;
