import React, { FunctionComponent } from 'react';
import Dialog from './Dialog';
import styles from '../styles/Dialog.module.scss';
import { InternalApiGateway } from '../gateways/internal-api';
import { User } from 'src/domain/user';
import { Team } from 'src/domain/team';
import { useRouter } from 'next/router';

const ConfirmationDialog: FunctionComponent<Props> = (props) => {
  const router = useRouter();
  const { groupId } = router.query as {
    groupId: string;
  };
  const handleSubmit = async () => {
    try {
      const gateway = new InternalApiGateway();
      await gateway.linkResident(
        props.user.email,
        props.residentId,
        props.team.name,
        groupId
      );

      router.push(props.redirect, undefined, { shallow: true });
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
  residentId: string;
  team: Team;
  user: User;
  redirect: string;
}

export default ConfirmationDialog;
