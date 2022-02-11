import React, { FunctionComponent } from 'react';
import styles from '../styles/UploaderPanel.module.scss';

const classNameFromProps = (props: Props) => {
  let className = `${styles.panel}`;
  if (props.set) className += ` ${styles.setPanel}`;
  if (props.error) className += ` ${styles.errorPanel}`;
  return className;
};

const acceptedMimeTypes = (): string => {
  const acceptedMimeTypes = [
    'application/msword',
    'application/octet-stream',
    'application/pdf',
    'application/vnd.apple.numbers',
    'application/vnd.apple.pages',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/bmp',
    'image/gif',
    'image/heic',
    'image/jpeg',
    'image/png',
    'text/plain',
    //'video/3gpp',
    //'video/mp4',
    //'video/quicktime',
  ];

  return acceptedMimeTypes.join(',');
};

const UploaderPanel: FunctionComponent<Props> = (props) => (
  <div className={classNameFromProps(props)}>
    <label className="govuk-label lbh-label" htmlFor={props.name}>
      {props.label}
    </label>
    {props.hint && (
      <p className="lbh-body-s" id={`${props.name}-hint`}>
        {props.hint}
      </p>
    )}
    {props.error && (
      <span className="govuk-error-message lbh-error-message">
        <span className="govuk-visually-hidden">Error:</span> {props.error}
      </span>
    )}
    <input
      type="file"
      className="govuk-file-upload  lbh-file-upload"
      name={props.name}
      id={props.name}
      data-testid="fileInput"
      accept={acceptedMimeTypes()}
      onChange={(e) => {
        if (e.currentTarget.files !== null) {
          props.setFieldValue(props.name, Array.from(e.currentTarget.files));
        }
      }}
      aria-describedby={props.hint && `${props.name}-hint`}
      multiple={true}
    />
  </div>
);

interface Props {
  setFieldValue(key: string, value: File[]): void;
  name: string;
  label: string;
  hint?: string;
  error?: string | null;
  set?: boolean;
}

export default UploaderPanel;
