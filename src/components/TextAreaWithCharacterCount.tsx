import React, { useMemo, useEffect, useState } from 'react';
import { Field as FormikField } from 'formik';

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
  value,
  name,
  id,
}: Props): JSX.Element => {
  const [characterCount, setCharacterCount] = useState(getLengthOfValue(value));

  const exceedingValue = useMemo(() => maxCharacterLength - characterCount, [
    characterCount,
  ]);

  useEffect(() => {
    setCharacterCount(String(value).length);
  }, [value]);

  return (
    <>
      <FormikField
        name={name}
        id={id}
        as="textarea"
        rows="3"
        data-testid="textarea"
        aria-describedby="more-detail-info"
        className={
          exceedingValue >= 0
            ? 'govuk-textarea govuk-js-character-count lbh-character-count'
            : 'govuk-textarea govuk-js-character-count lbh-character-count govuk-textarea--error'
        }
      />
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
  value: string;
  maxCharacterLength: number;
  name: string;
  id: string;
}
