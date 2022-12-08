import React from 'react';
import { useRouter } from 'next/router';
import CreateResidentForm from 'src/components/CreateResidentForm';
import {
  CreateResidentRequest,
  InternalApiGateway,
} from 'src/gateways/internal-api';
import { Constants } from 'src/helpers/Constants';
import Layout from 'src/components/DashboardLayout';
import Head from 'next/head';

const CreateResidentPage: React.FC = () => {
  const router = useRouter();
  const { teamId } = router.query;

  const createResident = async (resident: CreateResidentRequest) => {
    const gateway = new InternalApiGateway();
    //happy path
    const newResident = await gateway.createResident(
      Constants.DUMMY_EMAIL,
      resident
    );

    router.push(`/teams/${teamId}/dashboard/residents/${newResident.id}`);
  };

  return (
    <Layout teamId={teamId?.toString() || ''} feedbackUrl={'test'}>
      <Head>
        <title>
          Create A Resident | Document Evidence Service | Hackney Council
        </title>
      </Head>
      <CreateResidentForm createResident={createResident} />;
    </Layout>
  );
};

export default CreateResidentPage;
