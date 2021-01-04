import { DocumentType, IDocumentType } from '../domain/document-type';
import {
  // EvidenceRequestResponse,
  ResponseMapper,
} from '../boundary/response-mapper';
import Axios from 'axios';
import { EvidenceRequest } from 'src/domain/evidence-request';
import EvidenceRequestFixture from '../../cypress/fixtures/evidence-request-response.json';

export class InternalServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InternalServerError';
  }
}

export class InternalApiGateway {
  async getEvidenceRequests(): Promise<EvidenceRequest[]> {
    try {
      // TODO: Uncomment when endpoint is complete on API
      // const { data } = await Axios.get<EvidenceRequestResponse[]>(
      //   '/api/evidence/evidence_requests'
      // );
      const data = EvidenceRequestFixture;

      return data.map((er) => ResponseMapper.mapEvidenceRequest(er));
    } catch (err) {
      console.log(err);
      throw new InternalServerError('Internal server error');
    }
  }

  async getDocumentTypes(): Promise<DocumentType[]> {
    try {
      const { data } = await Axios.get<IDocumentType[]>(
        '/api/evidence/document_types'
      );
      return data.map((dt) => ResponseMapper.mapDocumentType(dt));
    } catch (err) {
      console.log(err);
      throw new InternalServerError('Internal server error');
    }
  }
}
