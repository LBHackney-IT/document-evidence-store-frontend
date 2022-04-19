import { DateTime } from 'luxon';
import { DocumentType } from './document-type';
import { Resident } from './resident';

export interface IEvidenceRequest {
  id: string;
  createdAt: DateTime;
  resident: Resident;
  deliveryMethods: DeliveryMethod[];
  documentTypes: DocumentType[];
  team: string;
  reason: string;
  userRequestedBy: string;
  noteToResident: string;
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
  team: string;
  reason: string;
  userRequestedBy: string;
  noteToResident: string;

  constructor(params: IEvidenceRequest) {
    this.id = params.id;
    this.createdAt = params.createdAt;
    this.resident = params.resident;
    this.deliveryMethods = params.deliveryMethods;
    this.documentTypes = params.documentTypes;
    this.team = params.team;
    this.reason = params.reason;
    this.userRequestedBy = params.userRequestedBy;
    this.noteToResident = params.noteToResident;
  }
}
