import React, { useMemo, useEffect, useState } from 'react';
import { useField, FieldHookConfig } from 'formik';

const getLengthOfValue = (
  initialValue: string | number | readonly string[] | undefined
) => {
  if (typeof initialValue === 'string') {
    return initialValue.length;
  }
  if (Array.isArray(initialValue)) {
    return initialValue.join(',').length;
  }
  return String(initialValue || '').length;
};

export const TextAreaWithCharacterCount = ({
  maxCharacterLength,
  dataTestId,
  rows,
  ...props
}: Props & FieldHookConfig<string>): JSX.Element => {
  const [field, meta] = useField(props);
  const [characterCount, setCharacterCount] = useState(
    getLengthOfValue(meta.value)
  );

  const exceedingValue = useMemo(() => maxCharacterLength - characterCount, [
    characterCount,
  ]);

  useEffect(() => {
    setCharacterCount(String(meta.value).length);
  }, [meta.value]);

  return (
    <>
      <textarea
        {...field}
        id={props.id}
        data-testid={dataTestId}
        rows={rows}
        className={
          exceedingValue >= 0
            ? 'govuk-textarea govuk-js-character-count lbh-character-count'
            : 'govuk-textarea govuk-js-character-count lbh-character-count govuk-textarea--error'
        }
      ></textarea>
      {exceedingValue >= 0 ? (
        <span className="govuk-hint" aria-live="polite">
          {`You have ${exceedingValue} ${pluralize(
            'character',
            exceedingValue
          )} remaining`}
        </span>
      ) : (
        <span className="govuk-error-message" aria-live="polite">
          {`You have ${Math.abs(exceedingValue)} ${pluralize(
            'character',
            exceedingValue
          )} too many`}
        </span>
      )}
      <noscript>You can enter up to {maxCharacterLength} characters</noscript>
    </>
  );
};

const pluralize = (word: string, value: number): string =>
  `${word}${Math.abs(value) !== 1 ? 's' : ''}`;

export interface Props {
  maxCharacterLength: number;
  dataTestId: string;
  rows: number;
}
