import { FunctionComponent, useMemo } from 'react';
import { EvidenceRequest } from '../domain/evidence-request';
import { Table } from 'lbh-frontend-react';

export const EvidenceRequestTable: FunctionComponent<Props> = ({
  residents,
}) => {
  const rows = useMemo(
    () =>
      residents.map((row) => {
        return {
          resident: row.resident.name,
          document: row.documentType?.title,
          uploaded: `${row.createdAt.toRelative()}`,
        };
      }),
    [residents]
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
          Header: 'Uploaded',
          accessor: 'uploaded',
          sortType: 'basic',
        },
      ]}
      data={rows}
      dueDateWarning={[]}
    />
  );
};

type Props = {
  residents: EvidenceRequest[];
};
