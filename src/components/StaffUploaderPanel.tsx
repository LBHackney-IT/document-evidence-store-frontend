import { FormikValues } from 'formik';
import React, { FunctionComponent, useRef } from 'react';
import { DocumentType } from 'src/domain/document-type';
import styles from '../styles/UploaderPanel.module.scss';
import DocumentTypeAndDescription from './DocumentTypeAndDescription';
import RemovePanelButton from './RemovePanelButton';
import { UploaderPanelError } from './StaffUploaderForm';
import { acceptedMimeTypes } from 'src/helpers/Constants';

const classNameFromProps = (props: Props) => {
  let className = `${styles.panel}`;
  if (props.error) className += ` ${styles.errorPanel}`;
  return className;
};

const StaffUploaderPanel: FunctionComponent<Props> = (props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className={classNameFromProps(props)}>
      <RemovePanelButton
        removePanel={props.removePanel}
        panelIndex={props.panelIndex}
        formValues={props.formValues}
        error={props.error}
      />
      <DocumentTypeAndDescription
        name={props.name}
        documentTypes={props.staffSelectedDocumentTypes}
        error={props.error}
      />
      {props.error?.files && (
        <span className="govuk-error-message lbh-error-message">
          <span className="govuk-visually-hidden">Error:</span>{' '}
          {props.error.files}
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        className="govuk-file-upload  lbh-file-upload"
        name={props.name}
        id={props.name}
        data-testid="fileInput"
        accept={acceptedMimeTypes()}
        onChange={(e) => {
          if (e.currentTarget.files !== null) {
            props.setFieldValue(
              `${props.name}.files`,
              Array.from(e.currentTarget.files)
            );
          }
        }}
        // aria-describedby={props.hint && `${props.name}-hint`}
        multiple={true}
      />
      <div>
        <button
          className="govuk-button govuk-button--secondary"
          data-testid="clear-selection-button"
          type="button"
          onClick={() => {
            props.setFieldValue(props.name, null);
            if (inputRef.current) {
              inputRef.current.value = '';
            }
          }}
        >
          Clear selection
        </button>
      </div>
    </div>
  );
};

interface Props {
  staffSelectedDocumentTypes: DocumentType[];
  setFieldValue(key: string, value: File[] | null): void;
  name: string;
  error?: UploaderPanelError | null;
  removePanel(panelIndex: number): void;
  panelIndex: number;
  formValues: FormikValues;
}

export default StaffUploaderPanel;
