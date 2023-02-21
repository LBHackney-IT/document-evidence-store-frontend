import React, { FunctionComponent, useMemo, useState } from 'react';
import { Resident } from '../domain/resident';
import Link from 'next/link';
import ConfirmationDialog from './ConfirmationDialog';
import { User } from 'src/domain/user';
import { Team } from 'src/domain/team';

export const LinkResidentSummaryTable: FunctionComponent<Props> = ({
  user,
  residents,
  team,
}) => {
  const rows = useMemo(
    () =>
      residents.map((row) => {
        return {
          id: row.id,
          referenceId: row.referenceId,
          name: row.name,
          email: row.email,
          phoneNumber: row.phoneNumber,
        };
      }),
    [residents]
  );

  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [clickedResident, setClickedResident] = useState({} as Resident);

  const handleOpenConfirmationDialog = () => {
    setConfirmationDialogOpen(true);
  };

  const handleCloseConfirmationDialog = () => {
    setConfirmationDialogOpen(false);
  };

  return (
    <>
      <table className="govuk-table  lbh-table">
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            <th scope="col" className="govuk-table__header">
              ID
            </th>
            <th scope="col" className="govuk-table__header">
              Name
            </th>
            <th scope="col" className="govuk-table__header">
              Email
            </th>
            <th
              scope="col"
              className="govuk-table__header govuk-table__header--numeric"
            >
              Mobile phone number
            </th>
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          {rows.map((row: Resident) => (
            <>
              <tr className="govuk-table__row" key={row.id}>
                <td className="govuk-table__cell">{row.referenceId}</td>
                <td className="govuk-table__cell">
                  <Link href={'#'}>
                    <a
                      className="lbh-link"
                      onClick={() => {
                        setClickedResident(row);
                        handleOpenConfirmationDialog();
                      }}
                    >
                      {row.name}
                    </a>
                  </Link>
                </td>
                <td className="govuk-table__cell">{row.email}</td>
                <td className="govuk-table__cell govuk-table__cell--numeric">
                  {row.phoneNumber}
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
      <ConfirmationDialog
        open={confirmationDialogOpen}
        onDismiss={handleCloseConfirmationDialog}
        user={user}
        residentId={clickedResident.id}
        team={team}
        redirect={`/teams/${team.id}/dashboard/residents/${clickedResident.id}`}
      />
    </>
  );
};

interface Props {
  user: User;
  residents: Array<Resident>;
  team: Team;
}

export default LinkResidentSummaryTable;
