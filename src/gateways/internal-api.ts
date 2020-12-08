import evidenceRequests from '../../test/fixture/evidence-request-response.json';
import singleEvidenceRequest from '../../test/fixture/evidence-request-response-singular.json';
import documentTypes from '../../test/fixture/document-types-response.json';
import { DocumentType } from '../domain/document-type';
import { EvidenceRequest } from '../domain/evidence-request';
import { ResponseMapper } from '../boundary/response-mapper';

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

export class InternalApiGateway {
  // private token: string;

  constructor() {
    // this.token = token;
  }

  async getEvidenceRequests(rapid?: boolean): Promise<EvidenceRequest[]> {
    if (!rapid) await sleep();
    return evidenceRequests.map((er) => ResponseMapper.mapEvidenceRequest(er));
  }

  async getEvidenceRequest(rapid?: boolean): Promise<EvidenceRequest> {
    if (!rapid) await sleep();
    return ResponseMapper.mapEvidenceRequest(singleEvidenceRequest);
  }

  async getDocumentTypes(rapid?: boolean): Promise<DocumentType[]> {
    if (!rapid) await sleep();
    return documentTypes.map((dt) => ResponseMapper.mapDocumentType(dt));
  }
}
