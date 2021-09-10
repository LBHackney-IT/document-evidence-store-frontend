import { Resident } from '../domain/resident';
import { DeliveryMethod, EvidenceRequest } from '../domain/evidence-request';
import { DateTime } from 'luxon';
import { DocumentType, IDocumentType } from '../domain/document-type';
import {
  DocumentState,
  DocumentSubmission,
} from '../domain/document-submission';
import {
  DocumentResponse,
  DocumentSubmissionResponse,
  EvidenceRequestResponse,
  ResidentResponse,
} from 'types/api';
import { Document } from 'src/domain/document';

export class ResponseMapper {
  static mapEvidenceRequest(attrs: EvidenceRequestResponse): EvidenceRequest {
    const resident = new Resident(attrs.resident);
    const createdAt = DateTime.fromISO(attrs.createdAt, { zone: 'utc' });
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
    const createdAt = DateTime.fromISO(attrs.createdAt, { zone: 'utc' });
    const claimValidUntil = DateTime.fromISO(attrs.claimValidUntil, {
      zone: 'utc',
    });
    const retentionExpiresAt = DateTime.fromISO(attrs.retentionExpiresAt, {
      zone: 'utc',
    });
    const state = DocumentState[attrs.state as keyof typeof DocumentState];
    const documentType = new DocumentType(attrs.documentType);
    const staffSelectedDocumentType = attrs.staffSelectedDocumentType
      ? new DocumentType(attrs.staffSelectedDocumentType)
      : undefined;
    const document = attrs.document
      ? this.mapDocument(attrs.document)
      : undefined;
    const rejectedAt = attrs.rejectedAt
      ? DateTime.fromISO(attrs.rejectedAt, { zone: 'utc' })
      : null;
    const userUpdatedBy = attrs.userUpdatedBy ? attrs.userUpdatedBy : null;
    return new DocumentSubmission({
      ...attrs,
      createdAt,
      claimValidUntil,
      retentionExpiresAt,
      state,
      rejectedAt,
      userUpdatedBy,
      documentType,
      staffSelectedDocumentType,
      document,
    });
  }

  static mapResidentResponseList(attrs: ResidentResponse[]): Resident[] {
    return attrs.map((r) => this.mapResidentResponse(r));
  }

  static mapResidentResponse(attr: ResidentResponse): Resident {
    return new Resident({
      ...attr,
    });
  }

  private static mapDocument(attrs: DocumentResponse): Document {
    return new Document({ ...attrs, fileSizeInBytes: attrs.fileSize });
  }
}
