import { IEvidenceRequest } from 'src/domain/evidence-request';
import { IDocumentType } from 'src/domain/document-type';
import { IDocumentSubmission } from 'src/domain/document-submission';

export type TokenDictionary = {
  [key: string]:
    | {
        [method: string]: string | undefined;
      }
    | undefined;
};

export interface EvidenceRequestResponse
  extends Omit<
    IEvidenceRequest,
    'createdAt' | 'deliveryMethods' | 'documentTypes'
  > {
  createdAt: string;
  deliveryMethods: string[];
  documentTypes: IDocumentType[];
  userRequestedBy: string;
}

export interface DocumentSubmissionResponse
  extends Omit<
    IDocumentSubmission,
    | 'createdAt'
    | 'claimValidUntil'
    | 'state'
    | 'documentType'
    | 'staffSelectedDocumentType'
    | 'document'
    | 'rejectedAt'
    | 'userUpdatedBy'
  > {
  createdAt: string;
  claimValidUntil: string;
  retentionExpiresAt: string;
  state: string;
  documentType: IDocumentType;
  rejectedAt?: string;
  acceptedAt?: string;
  userUpdatedBy?: string;
  staffSelectedDocumentType?: IDocumentType;
  document?: DocumentResponse;
}

export interface DocumentResponse {
  id: string;
  fileSize: number;
  fileType: string;
}

export interface ResidentResponse {
  name: string;
  email: string;
  phoneNumber: string;
  id: string;
  referenceId?: string;
}
