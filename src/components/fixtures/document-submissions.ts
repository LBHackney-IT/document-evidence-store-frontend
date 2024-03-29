import { DateTime } from 'luxon';
import {
  DocumentState,
  DocumentSubmission,
} from 'src/domain/document-submission';
import { DocumentType } from '../../domain/document-type';
import { Document } from '../../domain/document';

export const DocumentSubmissionsFixture = [
  new DocumentSubmission({
    id: '3fa85f64-5717-4562-b3fc-2c963f66ads0',
    createdAt: DateTime.fromISO('2022-09-19T15:34:12.299Z'),
    evidenceRequestId: '3fa85f64-5717-4562-b3fc-2c963f66afe0',
    claimValidUntil: DateTime.fromISO('2022-11-19T15:34:12.299Z'),
    retentionExpiresAt: DateTime.fromISO('2022-11-19T15:34:12.299Z'),
    claimId: '3fa85f64-5717-4562-b3fc-2c963f66adc0',
    rejectionReason: null,
    rejectedAt: null,
    acceptedAt: null,
    userUpdatedBy: null,
    state: DocumentState.UPLOADED,
    documentType: new DocumentType({
      id: 'proof-of-id',
      title: 'Proof of ID',
      description: 'A valid document that can be used to prove identity',
      enabled: true,
    }),
    document: new Document({
      id: '3fa85f64-5717-4562-b3fc-2c963f66afd0',
      fileSizeInBytes: 25300,
      fileType: 'image/png',
    }),
  }),
  new DocumentSubmission({
    id: '3fa85f64-5717-4562-b3fc-2c963f66ads1',
    createdAt: DateTime.fromISO('2022-09-19T15:34:12.299Z'),
    evidenceRequestId: '3fa85f64-5717-4562-b3fc-2c963f66afe0',
    claimValidUntil: DateTime.fromISO('2022-11-19T15:34:12.299Z'),
    retentionExpiresAt: DateTime.fromISO('2022-11-19T15:34:12.299Z'),
    claimId: '3fa85f64-5717-4562-b3fc-2c963f66adc0',
    rejectionReason: null,
    rejectedAt: null,
    acceptedAt: null,
    userUpdatedBy: null,
    state: DocumentState.APPROVED,
    documentType: new DocumentType({
      id: 'proof-of-id',
      title: 'Proof of ID',
      description: 'A valid document that can be used to prove identity',
      enabled: true,
    }),
    document: new Document({
      id: '3fa85f64-5717-4562-b3fc-2c963f66afd1',
      fileSizeInBytes: 25300,
      fileType: 'image/png',
    }),
  }),
  new DocumentSubmission({
    id: '3fa85f64-5717-4562-b3fc-2c963f66ads2',
    createdAt: DateTime.fromISO('2022-09-19T15:34:12.299Z'),
    evidenceRequestId: '3fa85f64-5717-4562-b3fc-2c963f66afe0',
    claimValidUntil: DateTime.fromISO('2022-11-19T15:34:12.299Z'),
    retentionExpiresAt: DateTime.fromISO('2022-11-19T15:34:12.299Z'),
    claimId: '3fa85f64-5717-4562-b3fc-2c963f66adc0',
    rejectionReason: null,
    rejectedAt: null,
    acceptedAt: null,
    userUpdatedBy: null,
    state: DocumentState.REJECTED,
    documentType: new DocumentType({
      id: 'proof-of-id',
      title: 'Proof of ID',
      description: 'A valid document that can be used to prove identity',
      enabled: true,
    }),
    document: new Document({
      id: '3fa85f64-5717-4562-b3fc-2c963f66afd2',
      fileSizeInBytes: 25300,
      fileType: 'image/png',
    }),
  }),
];
