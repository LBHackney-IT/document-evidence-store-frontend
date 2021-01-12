import Head from 'next/head';
import { Heading, HeadingLevels } from 'lbh-frontend-react';
import Layout from '../../components/DashboardLayout';
import { ReactNode } from 'react';
import Link from 'next/link';

const PageNotFound = (): ReactNode => (
  <Layout noService>
    <Head>
      <title>Choose a service</title>
    </Head>
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <Heading level={HeadingLevels.H2}>Choose a service</Heading>
        <ul className="lbh-list lbh-body-l">
          <li>
            <Link href="/dashboard">
              <a className="lbh-link">Housing benefit</a>
            </Link>
          </li>
          <li>
            <Link href="#/dashboard">
              <a className="lbh-link">Another service</a>
            </Link>
          </li>
          <li>
            <Link href="#/dashboard">
              <a className="lbh-link">Another service</a>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </Layout>
);

export default PageNotFound;
