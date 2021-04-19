import Head from 'next/head';
import Layout from '../components/ResidentLayout';
import React, { ReactNode } from 'react';

const PageNotFound = (): ReactNode => (
  <Layout feedbackUrl={process.env.FEEDBACK_FORM_RESIDENT_URL as string}>
    <Head>
      <title>Page not found</title>
    </Head>
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="lbh-heading-h1">Page not found</h1>
        <p className="lbh-body">
          {' '}
          If you typed the web address, check it is correct.
        </p>
        <p className="lbh-body">
          If you pasted the web address, check you copied the entire address.
        </p>
        <p className="lbh-body">
          If the web address is correct or you selected a link or button,{' '}
          <a
            href="https://hackney.gov.uk/contact-us"
            className="govuk-link lbh-link"
          >
            contact us
          </a>{' '}
          if you need to speak to someone about uploading your documents.{' '}
        </p>
      </div>
    </div>
  </Layout>
);

export default PageNotFound;
