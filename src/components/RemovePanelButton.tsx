import { FormikValues } from 'formik';
import React, { FunctionComponent } from 'react';
import styles from 'src/styles/RemoveBoxButton.module.scss';
import { UploaderPanelError } from './StaffUploaderForm';

const RemovePanelButton: FunctionComponent<Props> = (props) => {
  return (
    <div>
      <button
        className={styles.removeButton}
        type="button"
        onClick={() => {
          props.removePanel(props.panelIndex);
          props.formValues.staffUploaderPanel.splice(props.panelIndex, 1);
          if (props.error) {
            props.error.description = '';
            props.error.staffSelectedDocumentType = '';
            props.error.files = [];
          }
        }}
      >
        <img
          className={styles.removeButtonImage}
          src="/remove-box.svg"
          alt="remove-box"
        />
      </button>
    </div>
  );
};

interface Props {
  removePanel(panelIndex: number): void;
  panelIndex: number;
  formValues: FormikValues;
  error: UploaderPanelError | null | undefined;
}

export default RemovePanelButton;
