import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Resident } from '../domain/resident';
import ConfirmationDialog from './ConfirmationDialog';
import { User } from 'src/domain/user';
import { Team } from 'src/domain/team';
import Checkbox from '../components/Checkbox';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

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

  const handleOpenConfirmationDialog = () => {
    setConfirmationDialogOpen(true);
  };

  const handleCloseConfirmationDialog = () => {
    setConfirmationDialogOpen(false);
  };

  const validationSchema = Yup.object().shape({
    staffUploaderPanel: Yup.array().of(Yup.string()),
  });

  const handleSubmit = useCallback(handleOpenConfirmationDialog, [
    confirmationDialogOpen,
  ]);

  return (
    <Formik
      initialValues={{
        mergeCheckbox: [],
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values }) => (
        <Form>
          <table className="govuk-table  lbh-table">
            <thead className="govuk-table__head">
              <tr className="govuk-table__row">
                <th></th>
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
                  <tr
                    className="govuk-table__row"
                    key={row.id}
                    data-testid={`${row.id}-section`}
                  >
                    <Checkbox
                      label={''}
                      name={'mergeCheckbox'}
                      id={row.id}
                      value={row.id}
                      key={row.id}
                    />
                    <td className="govuk-table__cell">{row.referenceId}</td>
                    <td className="govuk-table__cell">{row.name}</td>
                    <td className="govuk-table__cell">{row.email}</td>
                    <td className="govuk-table__cell govuk-table__cell--numeric">
                      {row.phoneNumber}
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
          <button
            className="govuk-button lbh-button"
            type="submit"
            onClick={() => {
              handleOpenConfirmationDialog();
            }}
          >
            Link residents
          </button>
          <ConfirmationDialog
            open={confirmationDialogOpen}
            onDismiss={handleCloseConfirmationDialog}
            user={user}
            residentIds={values.mergeCheckbox}
            team={team}
          />
        </Form>
      )}
    </Formik>
  );
};

interface Props {
  user: User;
  residents: Array<Resident>;
  team: Team;
}

export default LinkResidentSummaryTable;
