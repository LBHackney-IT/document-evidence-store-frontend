import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import {
  Heading,
  HeadingLevels,
  FilterTabs,
  Input,
  Button,
} from 'lbh-frontend-react';
import Layout from '../components/DashboardLayout';
import { ReactNode } from 'react';
import styles from '../styles/ResidentSearch.module.scss';
import { EvidenceRequest } from '../domain/evidence-request';
import { InternalApiGateway } from '../gateways/internal-api';
import { EvidenceRequestTable } from '../components/EvidenceRequestTable';
import ResidentSearchForm from 'src/components/ResidentSearchForm';

const BrowseResidents = (): ReactNode => {
  const [evidenceRequests, setEvidenceRequests] = useState<EvidenceRequest[]>();

  useEffect(() => {
    const gateway = new InternalApiGateway();
    gateway.getEvidenceRequests().then(setEvidenceRequests);
  }, []);

  const table = useMemo(() => {
    if (!evidenceRequests) return <p>Loading</p>;

    return <EvidenceRequestTable requests={evidenceRequests} />;
  }, [evidenceRequests]);

  const handleSearch = () => {
    // handle search here
  };

  return (
    <Layout>
      <Head>
        <title>Browse residents</title>
      </Head>
      <Heading level={HeadingLevels.H2}>Browse residents</Heading>

      <ResidentSearchForm handleSearch={handleSearch} />

      <div className="govuk-tabs lbh-tabs" data-module="govuk-tabs">
        <h2 className="govuk-tabs__title">Results</h2>
        <ul className="govuk-tabs__list">
          <li className="govuk-tabs__list-item govuk-tabs__list-item--selected">
            <a className="govuk-tabs__tab" href="#past-day">
              To review (0)
            </a>
          </li>
          <li className="govuk-tabs__list-item">
            <a className="govuk-tabs__tab" href="#past-week">
              All (0)
            </a>
          </li>
        </ul>
        <section className="govuk-tabs__panel" id="past-day">
          <Heading level={HeadingLevels.H3}>To review</Heading>
          {table}
        </section>
        <section
          className="govuk-tabs__panel govuk-tabs__panel--hidden"
          id="past-week"
        >
          <Heading level={HeadingLevels.H3}>All</Heading>
          {table}
        </section>
      </div>
    </Layout>
  );
};

export default BrowseResidents;
