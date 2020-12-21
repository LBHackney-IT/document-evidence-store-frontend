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

  async getEvidenceRequests(): Promise<EvidenceRequest[]> {
    await sleep();
    return evidenceRequests.map((er) => ResponseMapper.mapEvidenceRequest(er));
  }

  async getEvidenceRequest(): Promise<EvidenceRequest> {
    await sleep();
    return ResponseMapper.mapEvidenceRequest(singleEvidenceRequest);
  }

  async getDocumentTypes(): Promise<DocumentType[]> {
    await sleep();
    return documentTypes.map((dt) => ResponseMapper.mapDocumentType(dt));
  }
}
