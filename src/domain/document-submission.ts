import { DateTime } from 'luxon';
import { DocumentType } from './document-type';
import { Document } from './document';

export enum DocumentState {
  UPLOADED = 'UPLOADED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface IDocumentSubmission {
  id: string;
  createdAt: DateTime;
  claimValidUntil: DateTime;
  retentionExpiresAt: DateTime;
  claimId: string;
  rejectionReason: string | null;
  rejectedAt: DateTime | null;
  acceptedAt: DateTime | null;
  userUpdatedBy: string | null;
  state: DocumentState;
  documentType: DocumentType;
  staffSelectedDocumentType?: DocumentType;
  document?: Document;
}

export class DocumentSubmission implements IDocumentSubmission {
  id: string;
  createdAt: DateTime;
  claimValidUntil: DateTime;
  retentionExpiresAt: DateTime;
  claimId: string;
  rejectionReason: string | null;
  rejectedAt: DateTime | null;
  acceptedAt: DateTime | null;
  userUpdatedBy: string | null;
  state: DocumentState;
  documentType: DocumentType;
  staffSelectedDocumentType?: DocumentType;
  document?: Document;

  constructor(params: IDocumentSubmission) {
    this.id = params.id;
    this.createdAt = params.createdAt;
    this.claimValidUntil = params.claimValidUntil;
    this.retentionExpiresAt = params.retentionExpiresAt;
    this.claimId = params.claimId;
    this.rejectionReason = params.rejectionReason;
    this.rejectedAt = params.rejectedAt;
    this.acceptedAt = params.acceptedAt;
    this.userUpdatedBy = params.userUpdatedBy;
    this.state = params.state;
    this.documentType = params.documentType;
    this.staffSelectedDocumentType = params.staffSelectedDocumentType;
    this.document = params.document;
  }
}
