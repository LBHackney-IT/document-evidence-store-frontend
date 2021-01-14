import React, { FunctionComponent } from 'react';
import styles from '../styles/PhaseBanner.module.scss';

const PhaseBanner: FunctionComponent = () => (
  <div
    role="complementary"
    className={`govuk-phase-banner lbh-phase-banner lbh-container ${styles.banner}`}
  >
    <p className="govuk-phase-banner__content">
      <strong
        className={`govuk-tag govuk-phase-banner__content__tag lbh-tag ${styles.tag}`}
      >
        Beta
      </strong>
      <span className="govuk-phase-banner__text lbh-body-xs">
        This is a new website.{' '}
        <a className="lbh-link" href={process.env.FEEDBACK_FORM_URL as string}>
          Your feedback
        </a>{' '}
        will help us improve it.
      </span>
    </p>
  </div>
);

export default PhaseBanner;
