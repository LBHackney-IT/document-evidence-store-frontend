import { FunctionComponent } from 'react';
import { DocumentType } from '../domain/document-type';
import SelectDocumentType from './SelectDocumentType';
import DocumentDescription from './DocumentDescription';
import documentStyles from '../styles/DocumentTypeAndDescription.module.scss';

const DocumentTypeAndDescription: FunctionComponent<Props> = ({
  name,
  documentTypes,
  panelIndex,
}) => {
  return (
    <div
      className={`govuk-form-group lbh-form-group ${documentStyles.formWrapper}`}
    >
      <div className={documentStyles.documentOptions}>
        <SelectDocumentType
          name={`${name}.staffSelectedDocumentType`}
          label="Document type"
          values={['Please select', ...documentTypes.map((dt) => dt.title)]}
          panelIndex={panelIndex}
        />
      </div>
      <div className={documentStyles.documentDescription}>
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
