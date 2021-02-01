import { DateTime } from 'luxon';
import { DocumentType } from './document-type';

export enum DocumentState {
  PENDING = 'PENDING',
  UPLOADED = 'UPLOADED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface UploadPolicy {
  url: string;
  fields: { [key: string]: string };
}

export interface IDocument {
  id: string;
  fileSize: number;
  fileType: string;
}

export interface IDocumentSubmission {
  id: string;
  createdAt: DateTime;
  claimId: string;
  rejectionReason: string | null;
  state: DocumentState;
  uploadPolicy?: UploadPolicy;
  documentType: DocumentType;
  document?: IDocument;
}

export class DocumentSubmission implements IDocumentSubmission {
  id: string;
  createdAt: DateTime;
  claimId: string;
  rejectionReason: string | null;
  state: DocumentState;
  uploadPolicy?: UploadPolicy;
  documentType: DocumentType;
  document?: IDocument;

  constructor(params: IDocumentSubmission) {
    this.id = params.id;
    this.createdAt = params.createdAt;
    this.claimId = params.claimId;
    this.rejectionReason = params.rejectionReason;
    this.state = params.state;
    this.uploadPolicy = params.uploadPolicy;
    this.documentType = params.documentType;
    this.document = params.document;
  }
}
