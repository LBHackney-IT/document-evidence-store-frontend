import { Resident } from '../domain/resident';
import {
  DeliveryMethod,
  EvidenceRequest,
  IEvidenceRequest,
} from '../domain/evidence-request';
import { DateTime } from 'luxon';
import { DocumentType, IDocumentType } from '../domain/document-type';
import {
  DocumentState,
  DocumentSubmission,
  IDocumentSubmission,
} from '../domain/document-submission';

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
  extends Omit<IDocumentSubmission, 'createdAt' | 'state' | 'documentType'> {
  createdAt: string;
  state: string;
  documentType: IDocumentType;
}

export class ResponseMapper {
  static mapEvidenceRequest(attrs: EvidenceRequestResponse): EvidenceRequest {
    const resident = new Resident(attrs.resident);
    const createdAt = DateTime.fromISO(attrs.createdAt);
    const deliveryMethods = attrs.deliveryMethods.map(
      (dm) => DeliveryMethod[dm as keyof typeof DeliveryMethod]
    );
    const documentTypes = attrs.documentTypes.map((dt) => new DocumentType(dt));

    return new EvidenceRequest({
      ...attrs,
      resident,
      createdAt,
      deliveryMethods,
      documentTypes,
    });
  }

  static mapDocumentType(attrs: IDocumentType): DocumentType {
    return new DocumentType(attrs);
  }

  static mapDocumentSubmission(
    attrs: DocumentSubmissionResponse
  ): DocumentSubmission {
    const createdAt = DateTime.fromISO(attrs.createdAt);
    const state = DocumentState[attrs.state as keyof typeof DocumentState];
    const documentType = new DocumentType(attrs.documentType);
    return new DocumentSubmission({ ...attrs, createdAt, state, documentType });
  }
}
