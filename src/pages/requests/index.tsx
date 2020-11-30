import { useState } from 'react';
import Head from 'next/head';
import { Heading, HeadingLevels, Table } from 'lbh-frontend-react';
import Link from 'next/link';
import Layout from '../../components/DashboardLayout';
import { ReactNode } from 'react';
import { DateTime } from 'luxon';
import pendingRequests from './_pending-requests.json';
import evidenceTypes from './_evidence-types.json';

const tableRowsFromData = (rawData: RequestData[]) =>
  rawData.map((row) => {
    return {
      resident: row.resident.name,
      documents: evidenceTypes.filter(
        (type) => type.id === row.document_type
      )[0].title,
      made: DateTime.fromISO(row.created_at).toRelative(),
      link: `/requests/${row.id}`,
    };
  });

interface RequestData {
  id: string;
  resident: {
    name: string;
  };
  document_type: string;
  created_at: string;
}

const SendARequest = (): ReactNode => {
  return (
    <Layout>
      <Head>
        <title>Pending requests</title>
      </Head>
      <Heading level={HeadingLevels.H2}>Pending requests</Heading>

      <Table
        columns={[
          {
            Header: 'Resident',
            accessor: 'resident',
            sortType: 'basic',
          },
          {
            Header: 'Documents',
            accessor: 'documents',
            sortType: 'basic',
          },
          {
            Header: 'Made',
            accessor: 'made',
            sortType: 'basic',
          },
        ]}
        data={tableRowsFromData(pendingRequests)}
        dueDateWarning={[]}
      />

      <Link href="/requests/new">
        <a className="govuk-button lbh-button">New request</a>
      </Link>
    </Layout>
  );
};

export default SendARequest;
