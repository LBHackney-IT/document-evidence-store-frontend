import React from 'react';
import CreateResidentForm from 'src/components/CreateResidentForm';
import { CreateResidentRequest } from 'src/gateways/internal-api';
import { Resident } from 'src/domain/resident';
import { EvidenceApiGateway } from 'src/gateways/evidence-api';
import { Constants } from 'src/helpers/Constants';

const CreateResidentPage: React.FC = () => {
  return <CreateResidentForm createResident={createResident} />;
};

const createResident = async (
  resident: CreateResidentRequest
): Promise<Resident> => {
  const gateway = new EvidenceApiGateway();
  //happy path
  const { name, email, phoneNumber } = resident;
  const newResident = await gateway.createResident(
    name,
    Constants.DUMMY_EMAIL,
    email,
    phoneNumber
  );
  console.log(`new resident created: ${JSON.stringify(newResident)}`);
  return newResident;

  /* routing -  return {
      redirect: {
        destination: `/teams/${userTeams[0].id}/dashboard`,
        permanent: false,
      },
    };  - can get query from url to populate team */

  //add error handling
};

export default CreateResidentPage;
