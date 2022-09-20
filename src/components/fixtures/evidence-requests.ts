import { DateTime } from 'luxon';
import { EvidenceRequest, DeliveryMethod } from 'src/domain/evidence-request';

export const EvidenceRequestsFixture = [
  new EvidenceRequest({
    id: '3fa85f64-5717-4562-b3fc-2c963f66afe0',
    createdAt: DateTime.fromISO('2022-09-19T15:34:12.299Z'),
    resident: {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afr0',
      referenceId: '123456',
      name: 'Resident 0',
      email: 'resident0@email.com',
      phoneNumber: '+447123456780',
    },
    deliveryMethods: [DeliveryMethod.SMS, DeliveryMethod.EMAIL],
    documentTypes: [
      {
        id: 'proof-of-id',
        title: 'Proof of ID',
        description: 'A valid document that can be used to prove identity',
        enabled: true,
      },
    ],
    team: 'Development Housing Team',
    reason: 'Proof of ID reason',
    userRequestedBy: 'test0@hackney.gov.uk',
    noteToResident: 'This is a note',
  }),
];
