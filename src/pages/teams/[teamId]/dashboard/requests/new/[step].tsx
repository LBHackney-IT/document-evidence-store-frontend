import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Layout from 'src/components/DashboardLayout';
import { EvidenceApiGateway } from 'src/gateways/evidence-api';
import { withAuth, WithUser } from 'src/helpers/authed-server-side-props';
import NewRequestFormStep1 from '../../../../../../components/NewRequestFormStep1';
import NewRequestFormStep2 from '../../../../../../components/NewRequestFormStep2';
import ConfirmRequestDialog from '../../../../../../components/ConfirmRequestDialog';
import { DocumentType } from '../../../../../../domain/document-type';
import {
  EvidenceRequestRequest,
  EvidenceRequestForm,
  InternalApiGateway,
} from '../../../../../../gateways/internal-api';
import { schemaNewRequestFormStep1 } from '../../../../../../components/NewRequestFormStep1';
import { schemaNewRequestFormStep2 } from '../../../../../../components/NewRequestFormStep2';
import { RequestAuthorizer } from '../../../../../../services/request-authorizer';
import { TeamHelper } from '../../../../../../services/team-helper';
import { Team } from '../../../../../../domain/team';
import { User } from '../../../../../../domain/user';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';

type RequestsNewPageProps = {
  documentTypes: DocumentType[];
  team: Team;
  user: User;
};

const schema = [
  schemaNewRequestFormStep1,
  schemaNewRequestFormStep2,
  Yup.object().shape({}),
];

const RequestsNewPage: NextPage<WithUser<RequestsNewPageProps>> = ({
  documentTypes,
  team,
  user,
}) => {
  const { push, query, replace } = useRouter();
  const [complete, setComplete] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [deliveryMethods, setDeliveryMethods] = useState<string[]>(['']);
  const [previousStepNumber, setPreviousStepNumber] = useState(0);

  let currentStep: number = Array.isArray(query.step)
    ? parseInt(query.step[0])
    : parseInt(query.step || '');

  useEffect(() => {
    window.onpopstate = () => {
      setPreviousStepNumber(previousStepNumber - 1);
    };
    if (currentStep - 1 !== previousStepNumber) {
      replace(`/teams/${team.id}/dashboard/requests/new/1`);
    }
  }, [currentStep]);

  const initialValues: EvidenceRequestForm = {
    resident: {
      name: '',
      email: '',
      phoneNumber: '',
    },
    team: team.name,
    reason: team.reasons[0].name,
    documentTypes: [],
    emailCheckbox: [],
    phoneNumberCheckbox: [],
  };

  const steps = [1, 2, 3];

  function renderStepContent(step: number) {
    switch (step) {
      case 1:
        return <NewRequestFormStep1 team={team} />;
      case 2:
        return <NewRequestFormStep2 documentTypes={documentTypes} />;
      case 3:
        return (
          <ConfirmRequestDialog
            documentTypes={documentTypes}
            deliveryMethods={deliveryMethods}
            onAccept={submitHandler}
            onDismiss={() => {
              push(
                `/teams/${team.id}/dashboard/requests/new/${currentStep - 1}`
              );
              setPreviousStepNumber(previousStepNumber - 1);
            }}
          />
        );
      default:
        return <div>Not Found</div>;
    }
  }

  const currentValidationSchema = schema[currentStep - 1];

  const submitHandler = async (values: EvidenceRequestForm) => {
    const payload = buildEvidenceRequestRequest(values);
    if (currentStep < steps.length) {
      setPreviousStepNumber(currentStep);
      push(`/teams/${team.id}/dashboard/requests/new/${currentStep + 1}`);
      return;
    }
    try {
      const gateway = new InternalApiGateway();
      const requestPayload: EvidenceRequestRequest = {
        ...payload,
        userRequestedBy: user.email,
        notificationEmail: user.email,
      };
      await gateway.createEvidenceRequest(user.email, requestPayload);
      setComplete(true);
    } catch (err) {
      setSubmitError(true);
      setComplete(true);
    }
  };

  const buildEvidenceRequestRequest = (values: EvidenceRequestForm) => {
    const deliveryMethods: string[] = [];
    if (values.emailCheckbox.length !== 0 && values.resident.email !== '') {
      deliveryMethods.push('EMAIL');
    }

    if (
      values.phoneNumberCheckbox.length !== 0 &&
      values.resident.phoneNumber !== ''
    ) {
      deliveryMethods.push('SMS');
    }
    setDeliveryMethods(deliveryMethods);
    const payload: EvidenceRequestRequest = {
      ...values,
      deliveryMethods: deliveryMethods,
    };

    return payload;
  };

  return (
    <Layout teamId={team.id}>
      <Head>
        <title>
          Make a new request | Document Evidence Service | Hackney Council
        </title>
      </Head>
      {complete ? (
        submitError ? (
          <span className="govuk-error-message lbh-error-message">
            An error has occured. Please try again.
          </span>
        ) : (
          <p className="lbh-body">Thanks!</p>
        )
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={currentValidationSchema}
          onSubmit={submitHandler}
        >
          {({ isSubmitting }) => (
            <Form>
              {renderStepContent(currentStep)}
              <button
                className="govuk-button lbh-button"
                type="submit"
                disabled={isSubmitting}
              >
                {currentStep < steps.length ? 'Continue' : 'Send request'}
              </button>
            </Form>
          )}
        </Formik>
      )}
    </Layout>
  );
};

export const getServerSideProps = withAuth<RequestsNewPageProps>(
  async (ctx) => {
    const { teamId } = ctx.query as {
      teamId: string;
    };

    const user = new RequestAuthorizer().authoriseUser(ctx.req?.headers.cookie);
    const userAuthorizedToViewTeam = TeamHelper.userAuthorizedToViewTeam(
      TeamHelper.getTeamsJson(),
      user,
      teamId
    );

    const team = TeamHelper.getTeamFromId(TeamHelper.getTeamsJson(), teamId);
    if (!userAuthorizedToViewTeam || team === undefined || user === undefined) {
      return {
        redirect: {
          destination: '/teams',
          permanent: false,
        },
      };
    }

    const gateway = new EvidenceApiGateway();
    const documentTypes = await gateway.getDocumentTypes(user.email, team.name);
    return { props: { documentTypes, team, user } };
  }
);

export default RequestsNewPage;
