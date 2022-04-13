import React, { useMemo, useEffect, useState } from 'react';
import { EvidenceRequestForm } from 'src/gateways/internal-api';
import { Field as FormikField, useFormikContext } from 'formik';

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
  name,
  id,
  dataTestId,
}: Props): JSX.Element => {
  const { values } = useFormikContext<any>();
  const [characterCount, setCharacterCount] = useState(
    getLengthOfValue(values[name])
  );

  const exceedingValue = useMemo(() => maxCharacterLength - characterCount, [
    characterCount,
  ]);

  useEffect(() => {
    setCharacterCount(String(values[name]).length);
  }, [values[name]]);

  return (
    <>
      <FormikField
        name={name}
        id={id}
        as="textarea"
        rows="3"
        data-testid={dataTestId}
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
  maxCharacterLength: number;
  name: string;
  id: string;
  dataTestId: string;
}
