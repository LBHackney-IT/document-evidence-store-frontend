import { useFormikContext } from 'formik';
import React, { FunctionComponent, useRef } from 'react';
import { DocumentType } from 'src/domain/document-type';
import styles from '../styles/UploaderPanel.module.scss';
import DocumentTypeAndDescription from './DocumentTypeAndDescription';
import RemovePanelButton from './RemovePanelButton';
import { StaffUploadFormValues } from './StaffUploaderForm';
import { getIn } from 'formik';
import { acceptedMimeTypes } from 'src/helpers/Constants';

const StaffUploaderPanel: FunctionComponent<Props> = (props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { errors, touched } = useFormikContext<StaffUploadFormValues>();
  const classNameFromProps = (props: Props) => {
    let className = `${styles.panel}`;
    if (
      errors.staffUploaderPanel &&
      touched.staffUploaderPanel &&
      ((getIn(
        touched.staffUploaderPanel[props.panelIndex],
        'staffSelectedDocumentType'
      ) &&
        getIn(
          errors.staffUploaderPanel[props.panelIndex],
          'staffSelectedDocumentType'
        )) ||
        (getIn(touched.staffUploaderPanel[props.panelIndex], 'description') &&
          getIn(errors.staffUploaderPanel[props.panelIndex], 'description')) ||
        (getIn(touched.staffUploaderPanel[props.panelIndex], 'files') &&
          getIn(errors.staffUploaderPanel[props.panelIndex], 'files')))
    ) {
      className += ` ${styles.errorPanel}`;
    }
    return className;
  };
  return (
    <div className={classNameFromProps(props)}>
      <RemovePanelButton
        removePanel={props.removePanel}
        panelIndex={props.panelIndex}
      />
      <DocumentTypeAndDescription
        name={props.name}
        documentTypes={props.staffSelectedDocumentTypes}
        panelIndex={props.panelIndex}
      />
      {errors.staffUploaderPanel &&
        getIn(errors.staffUploaderPanel[props.panelIndex], 'files') &&
        touched.staffUploaderPanel &&
        getIn(touched.staffUploaderPanel[props.panelIndex], 'files') && (
          <span className="govuk-error-message lbh-error-message">
            <span className="govuk-visually-hidden">Error:</span>{' '}
            {getIn(errors.staffUploaderPanel[props.panelIndex], 'files')}
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
        multiple={true}
      />
      <div>
        <button
          className="govuk-button govuk-button--secondary"
          data-testid="clear-selection-button"
          type="button"
          onClick={() => {
            props.setFieldValue(
              `staffUploaderPanel[${props.panelIndex}].files`,
              []
            );
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
  removePanel(panelIndex: number): void;
  panelIndex: number;
}

export default StaffUploaderPanel;
