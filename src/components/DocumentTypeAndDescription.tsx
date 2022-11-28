import { FunctionComponent } from 'react';
import SelectOption from './SelectOption';
import { DocumentType } from '../domain/document-type';
import Field from './Field';
import { UploaderPanelError } from './StaffUploaderForm';

const DocumentTypeAndDescription: FunctionComponent<Props> = ({
  name,
  documentTypes,
  error,
}) => {
  return (
    <div
      className="govuk-form-group lbh-form-group"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr', // extract this in a css module
      }}
    >
      <div style={{ display: 'inline-block' }}>
        <SelectOption
          name={`${name}.staffSelectedDocumentType`}
          label="Document type"
          values={['Please select', ...documentTypes.map((dt) => dt.title)]}
        />
      </div>
      <div style={{ display: 'inline-block', marginTop: '0px' }}>
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
