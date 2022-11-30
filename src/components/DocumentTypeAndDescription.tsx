import { FunctionComponent } from 'react';
import { DocumentType } from '../domain/document-type';
import SelectDocumentType from './SelectDocumentType';
import DocumentDescription from './DocumentDescription';

const DocumentTypeAndDescription: FunctionComponent<Props> = ({
  name,
  documentTypes,
  panelIndex,
}) => {
  return (
    <div
      className="govuk-form-group lbh-form-group"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
      }}
    >
      <div style={{ display: 'inline-block' }}>
        <SelectDocumentType
          name={`${name}.staffSelectedDocumentType`}
          label="Document type"
          values={['Please select', ...documentTypes.map((dt) => dt.title)]}
          panelIndex={panelIndex}
        />
      </div>
      <div style={{ display: 'inline-block', marginTop: '0px' }}>
        <DocumentDescription
          label="Description"
          name={`${name}.description`}
          style={{ marginTop: '4px' }}
          panelIndex={panelIndex}
        />
      </div>
    </div>
  );
};

interface Props {
  name: string;
  documentTypes: DocumentType[];
  panelIndex: number;
}

export default DocumentTypeAndDescription;
