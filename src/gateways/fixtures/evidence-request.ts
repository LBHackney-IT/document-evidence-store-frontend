import { DateTime } from 'luxon';
import { EvidenceRequest, DeliveryMethod } from 'src/domain/evidence-request';

// id: '3fa85f64-5717-4562-b3fc-2c963f66afb6',

export const EvidenceRequestsFixture = [
  new EvidenceRequest({
    id: 'EVIDENCE REQUEST OBJECT',
    createdAt: DateTime.fromISO('2020-11-30T15:34:12.299Z'),
    resident: {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afb6',
      referenceId: '123456',
      name: 'Namey McName',
      email: 'frodo@bagend.com',
      phoneNumber: '+447123456780',
    },
    deliveryMethods: [DeliveryMethod.SMS, DeliveryMethod.EMAIL],
    documentTypes: [
      {
        id: 'passport-scan',
        title: 'Passport',
        description: 'A valid passport open at the photo page',
        enabled: true,
      },
    ],
    team: 'Development Housing Team',
    reason: 'staging-reason',
    userRequestedBy: 'test@hackney.gov.uk',
    noteToResident: 'Not all those who wander are lost',
  }),
  new EvidenceRequest({
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
    createdAt: DateTime.fromISO('2020-11-30T15:34:12.299Z'),
    resident: {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afb6',
      referenceId: '123456',
      name: 'Namey McName',
      email: 'frodo@bagend.com',
      phoneNumber: '+447123456780',
    },
    deliveryMethods: [DeliveryMethod.SMS, DeliveryMethod.EMAIL],
    documentTypes: [
      {
        id: 'passport-scan',
        title: 'Passport',
        description: 'A valid passport open at the photo page',
        enabled: true,
      },
    ],
    team: 'Development Housing Team',
    reason: 'staging-reason',
    userRequestedBy: 'test@hackney.gov.uk',
    noteToResident: 'Not all those who wander are lost',
  }),
  new EvidenceRequest({
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa8',
    createdAt: DateTime.fromISO('2020-11-30T15:34:12.299Z'),
    resident: {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afb6',
      referenceId: '123456',
      name: 'Namey McName',
      email: 'frodo@bagend.com',
      phoneNumber: '+447123456780',
    },
    deliveryMethods: [DeliveryMethod.SMS, DeliveryMethod.EMAIL],
    documentTypes: [
      {
        id: 'passport-scan',
        title: 'Passport',
        description: 'A valid passport open at the photo page',
        enabled: true,
      },
    ],
    team: 'Development Housing Team',
    reason: 'staging-reason',
    userRequestedBy: 'test@hackney.gov.uk',
    noteToResident: 'Not all those who wander are lost',
  }),
];
