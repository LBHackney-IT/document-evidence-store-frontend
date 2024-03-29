import React, { FunctionComponent, useRef } from 'react';
import styles from '../styles/UploaderPanel.module.scss';
import { acceptedMimeTypes } from 'src/helpers/Constants';

const classNameFromProps = (props: Props) => {
  let className = `${styles.panel}`;
  if (props.set) className += ` ${styles.setPanel}`;
  if (props.error) className += ` ${styles.errorPanel}`;
  return className;
};

const UploaderPanel: FunctionComponent<Props> = (props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
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
        ref={inputRef}
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
  setFieldValue(key: string, value: File[] | null): void;
  name: string;
  label: string;
  hint?: string;
  error?: string | null;
  set?: boolean;
}

export default UploaderPanel;
