import { FunctionComponent, useMemo } from 'react';
import { EvidenceRequest } from '../domain/evidence-request';
import { Table } from 'lbh-frontend-react';

export const EvidenceRequestTable: FunctionComponent<Props> = ({
  requests,
}) => {
  const rows = useMemo(
    () =>
      requests.map((row) => {
        return {
          resident: row.resident.name,
          document: row.documentType?.title,
          made: `${row.createdAt.toRelative()}`,
        };
      }),
    [requests]
  );

  return (
    <Table
      columns={[
        {
          Header: 'Resident',
          accessor: 'resident',
          sortType: 'basic',
        },
        {
          Header: 'Document',
          accessor: 'document',
          sortType: 'basic',
        },
        {
          Header: 'Made',
          accessor: 'made',
          sortType: 'basic',
        },
      ]}
      data={rows}
      dueDateWarning={[]}
    />
  );
};

type Props = {
  requests: EvidenceRequest[];
};
