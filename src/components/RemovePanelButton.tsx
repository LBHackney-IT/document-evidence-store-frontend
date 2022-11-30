import { useFormikContext } from 'formik';
import React, { FunctionComponent } from 'react';
import styles from 'src/styles/RemoveBoxButton.module.scss';
import { StaffUploadFormValues } from './StaffUploaderForm';

const RemovePanelButton: FunctionComponent<Props> = (props) => {
  const {
    values,
    errors,
    setFieldError,
  } = useFormikContext<StaffUploadFormValues>();
  return (
    <div>
      <button
        className={styles.removeButton}
        type="button"
        onClick={() => {
          props.removePanel(props.panelIndex);
          values.staffUploaderPanel.splice(props.panelIndex, 1);
          if (
            errors.staffUploaderPanel &&
            errors.staffUploaderPanel[props.panelIndex]
          ) {
            setFieldError(`staffUploaderPanel.${props.panelIndex}`, '');
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
}

export default RemovePanelButton;
