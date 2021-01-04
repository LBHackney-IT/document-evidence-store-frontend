import { DateTime } from 'luxon';
import { DocumentType } from './document-type';
import { Resident } from './resident';

interface IEvidenceRequest {
  id: string;
  createdAt: DateTime;
  resident: Resident;
  deliveryMethods: DeliveryMethod[];
  documentTypes: DocumentType[];
  serviceRequestedBy: string;
}

export enum DeliveryMethod {
  SMS,
  EMAIL,
}

export class EvidenceRequest implements IEvidenceRequest {
  id: string;
  createdAt: DateTime;
  resident: Resident;
  deliveryMethods: DeliveryMethod[];
  documentTypes: DocumentType[];
  serviceRequestedBy: string;

  constructor(params: IEvidenceRequest) {
    this.id = params.id;
    this.createdAt = params.createdAt;
    this.resident = params.resident;
    this.deliveryMethods = params.deliveryMethods;
    this.documentTypes = params.documentTypes;
    this.serviceRequestedBy = params.serviceRequestedBy;
  }
}
