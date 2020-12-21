import React, { FunctionComponent } from 'react';
import { Label, ErrorMessage } from 'lbh-frontend-react';
import styles from '../styles/UploaderPanel.module.scss';

const classNameFromProps = (props: Props) => {
  let className = `${styles.panel}`;
  if (props.set) className += ` ${styles.setPanel}`;
  if (props.error) className += ` ${styles.errorPanel}`;
  return className;
};

const UploaderPanel: FunctionComponent<Props> = (props) => (
  <div className={classNameFromProps(props)}>
    <Label labelFor={props.name}>{props.label}</Label>
    {props.hint && (
      <p className="lbh-body-s" id={`${props.name}-hint`}>
        {props.hint}
      </p>
    )}
    {props.error && <ErrorMessage>{props.error}</ErrorMessage>}
    <input
      type="file"
      className="govuk-file-upload  lbh-file-upload"
      name={props.name}
      id={props.name}
      data-testid="fileInput"
      accept="image/*,application/pdf"
      onChange={(e) => {
        if (e.currentTarget.files !== null)
          props.setFieldValue(props.name, e.currentTarget.files[0]);
      }}
      aria-describedby={props.hint && `${props.name}-hint`}
    />
  </div>
);

interface Props {
  setFieldValue(key: string, value: File): void;
  name: string;
  label: string;
  hint?: string;
  error?: string | null;
  set?: boolean;
}

export default UploaderPanel;
