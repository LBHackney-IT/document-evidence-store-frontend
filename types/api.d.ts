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
}

export interface DocumentSubmissionResponse
  extends Omit<
    IDocumentSubmission,
    | 'createdAt'
    | 'state'
    | 'documentType'
    | 'staffSelectedDocumentType'
    | 'document'
  > {
  createdAt: string;
  state: string;
  documentType: IDocumentType;
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
}
