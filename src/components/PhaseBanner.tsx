import React, { FunctionComponent } from 'react';
import styles from '../styles/PhaseBanner.module.scss';

const PhaseBanner: FunctionComponent<Props> = (props) => (
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
        <a
          href={`${props.feedbackUrl}`}
          target="_blank"
          className="lbh-link"
          rel="noreferrer"
        >
          Your feedback
        </a>{' '}
        will help us improve it.
      </span>
    </p>
  </div>
);

export interface Props {
  feedbackUrl: string;
}

export default PhaseBanner;
