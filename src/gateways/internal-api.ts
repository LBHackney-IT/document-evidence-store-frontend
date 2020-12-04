import evidenceRequests from '../../test/fixture/evidence-request-response.json';
import documentTypes from '../../test/fixture/document-types-response.json';
import { DocumentType } from '../domain/document-type';
import { EvidenceRequest } from '../domain/evidence-request';
import { ResponseMapper } from '../boundary/response-mapper';

export class InternalApiGateway {
  // private token: string;

  constructor() {
    // this.token = token;
  }

  getEvidenceRequests(): EvidenceRequest[] {
    const documentTypes = this.getDocumentTypes();
    return evidenceRequests.map((er) =>
      ResponseMapper.mapEvidenceRequest(er, documentTypes)
    );
  }

  getDocumentTypes(): DocumentType[] {
    return documentTypes.map((dt) => ResponseMapper.mapDocumentType(dt));
  }
}
