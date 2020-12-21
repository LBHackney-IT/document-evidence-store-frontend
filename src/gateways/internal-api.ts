import { DocumentType, IDocumentType } from '../domain/document-type';
import {
  EvidenceRequestResponse,
  ResponseMapper,
} from '../boundary/response-mapper';
import Axios from 'axios';
import { EvidenceRequest } from 'src/domain/evidence-request';

export class InternalServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InternalServerError';
  }
}

export class InternalApiGateway {
  async getEvidenceRequests(): Promise<EvidenceRequest[]> {
    try {
      const { data } = await Axios.get<EvidenceRequestResponse[]>(
        '/api/evidence/evidence_requests'
      );

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
