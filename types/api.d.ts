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

export type DeliveryMethodResponse = 'sms' | 'email';

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
    'createdAt' | 'state' | 'documentType' | 'document'
  > {
  createdAt: string;
  state: string;
  documentType: IDocumentType;
  document?: IDocument;
}

export interface IDocument {
  id: string;
  fileSize: number;
  fileType: string;
}
