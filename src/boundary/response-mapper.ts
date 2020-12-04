import { Resident } from '../domain/resident';
import { DeliveryMethod, EvidenceRequest } from '../domain/evidence-request';
import { DateTime } from 'luxon';
import { DocumentType, IDocumentType } from '../domain/document-type';

export type DeliveryMethodResponse = 'sms' | 'email';
export interface EvidenceRequestResponse {
  id: string;
  createdAt: string;
  deliveryMethods: string[];
  documentType: IDocumentType;
  serviceRequestedBy: string;
  resident: {
    name: string;
    email: string;
    phoneNumber: string;
  };
}

export class ResponseMapper {
  static mapEvidenceRequest(attrs: EvidenceRequestResponse): EvidenceRequest {
    const resident = new Resident(attrs.resident);
    const createdAt = DateTime.fromISO(attrs.createdAt);
    const deliveryMethods = attrs.deliveryMethods.map(
      (dm) => DeliveryMethod[dm as keyof typeof DeliveryMethod]
    );
    const documentType = new DocumentType(attrs.documentType);

    return new EvidenceRequest({
      ...attrs,
      resident,
      createdAt,
      deliveryMethods,
      documentType,
    });
  }

  static mapDocumentType(attrs: IDocumentType): DocumentType {
    return new DocumentType(attrs);
  }
}
