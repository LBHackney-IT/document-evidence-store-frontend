import { DateTime } from 'luxon';

export enum DocumentState {
  PENDING,
  UPLOADED,
  APPROVED,
  REJECTED,
}

export interface UploadPolicy {
  url: string;
  fields: { [key: string]: string };
}

export interface IDocumentSubmission {
  id: string;
  createdAt: DateTime;
  claimId: string;
  rejectionReason?: string;
  state: DocumentState;
  uploadPolicy?: UploadPolicy;
  documentType: string;
}

export class DocumentSubmission implements IDocumentSubmission {
  id: string;
  createdAt: DateTime;
  claimId: string;
  rejectionReason?: string;
  state: DocumentState;
  uploadPolicy?: UploadPolicy;
  documentType: string;

  constructor(params: IDocumentSubmission) {
    this.id = params.id;
    this.createdAt = params.createdAt;
    this.claimId = params.claimId;
    this.rejectionReason = params.rejectionReason;
    this.state = params.state;
    this.uploadPolicy = params.uploadPolicy;
    this.documentType = params.documentType;
  }
}
