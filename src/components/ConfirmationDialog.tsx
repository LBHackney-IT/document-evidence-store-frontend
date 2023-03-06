import React, { FunctionComponent } from 'react';
import Dialog from './Dialog';
import styles from '../styles/Dialog.module.scss';
import { InternalApiGateway } from '../gateways/internal-api';
import { User } from 'src/domain/user';
import { Team } from 'src/domain/team';
import { useRouter } from 'next/router';

const ConfirmationDialog: FunctionComponent<Props> = (props) => {
  const router = useRouter();
  const { groupId, name, email, phone } = router.query as {
    groupId: string;
    name: string;
    email: string;
    phone: string;
  };
  const handleSubmit = async () => {
    try {
      const gateway = new InternalApiGateway();
      const response = await gateway.mergeAndLinkResident(
        props.user.email,
        props.team.name,
        groupId,
        name,
        email,
        phone,
        props.residentIds
      );
      router.push(
        `/teams/${props.team.id}/dashboard/residents/${response.resident.id}`,
        undefined,
        { shallow: true }
      );
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Dialog
      open={props.open}
      onDismiss={props.onDismiss}
      title="Are you sure you want to link the Housing Register resident with this DES resident?"
    >
      <div className={styles.actions}>
        <button
          className="govuk-button lbh-button"
          onClick={() => handleSubmit()}
          type="submit"
        >
          Yes, link residents
        </button>
        <button
          onClick={props.onDismiss}
          className={`lbh-body lbh-link ${styles.cancelButton}`}
          type="button"
        >
          No, cancel
        </button>
      </div>
    </Dialog>
  );
};

interface Props {
  open: boolean;
  onDismiss(): void;
  residentIds: string[];
  team: Team;
  user: User;
}

export default ConfirmationDialog;
