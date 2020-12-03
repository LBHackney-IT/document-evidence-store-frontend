import Head from 'next/head';
import { Heading, HeadingLevels } from 'lbh-frontend-react';
import Link from 'next/link';
import Layout from '../components/ResidentLayout';
import { ReactNode } from 'react';

const PageNotFound = (): ReactNode => (
  <Layout>
    <Head>
      <title>Page not found</title>
    </Head>
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <Heading level={HeadingLevels.H1}>Page not found</Heading>
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
