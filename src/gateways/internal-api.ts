import Axios from 'axios';
import {
  DocumentSubmission,
  IDocumentSubmission,
} from 'src/domain/document-submission';
import { EvidenceRequest } from 'src/domain/evidence-request';
import { IResident } from 'src/domain/resident';
import EvidenceRequestsFixture from '../../cypress/fixtures/evidence-request-response.json';
import {
  DocumentSubmissionResponse,
  EvidenceRequestResponse,
  ResponseMapper,
} from '../boundary/response-mapper';
import { DocumentType, IDocumentType } from '../domain/document-type';

export class InternalServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InternalServerError';
  }
}

export interface EvidenceRequestRequest {
  deliveryMethods: string[];
  documentTypes: string[];
  resident: Omit<IResident, 'id'>;
  serviceRequestedBy?: string;
  userRequestedBy?: string;
}

export class InternalApiGateway {
  async getEvidenceRequests(): Promise<EvidenceRequest[]> {
    try {
      // TODO: Uncomment when endpoint is complete on API
      // const { data } = await Axios.get<EvidenceRequestResponse[]>(
      //   '/api/evidence/evidence_requests'
      // );
      await new Promise((resolve) => setTimeout(resolve, 100));
      const data = EvidenceRequestsFixture;

      return data.map((er) => ResponseMapper.mapEvidenceRequest(er));
    } catch (err) {
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }

  async getEvidenceRequest(id: string): Promise<EvidenceRequest> {
    try {
      const { data } = await Axios.get<EvidenceRequestResponse>(
        `/api/evidence/evidence_requests/${id}`
      );
      return ResponseMapper.mapEvidenceRequest(data);
    } catch (err) {
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }

  async createEvidenceRequest(
    payload: EvidenceRequestRequest
  ): Promise<EvidenceRequest> {
    try {
      const { data } = await Axios.post<EvidenceRequestResponse>(
        '/api/evidence/evidence_requests',
        payload
      );

      return ResponseMapper.mapEvidenceRequest(data);
    } catch (err) {
      console.error(err);
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
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }

  async createDocumentSubmission(
    evidenceRequestId: string,
    documentType: string
  ): Promise<DocumentSubmission> {
    try {
      const { data } = await Axios.post<DocumentSubmissionResponse>(
        `/api/evidence/evidence_requests/${evidenceRequestId}/document_submissions`,
        { documentType }
      );
      return ResponseMapper.mapDocumentSubmission(data);
    } catch (err) {
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }

  async updateDocumentSubmission(
    documentSubmissionId: string,
    params: Partial<IDocumentSubmission>
  ): Promise<DocumentSubmission> {
    try {
      const { data } = await Axios.patch<DocumentSubmissionResponse>(
        `/api/evidence/document_submissions/${documentSubmissionId}`,
        params
      );
      return ResponseMapper.mapDocumentSubmission(data);
    } catch (err) {
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }
}
