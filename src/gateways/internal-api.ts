import Axios, { AxiosInstance } from 'axios';
import {
  DocumentSubmission,
  IDocumentSubmission,
} from 'src/domain/document-submission';
import { EvidenceRequest } from 'src/domain/evidence-request';
import { IResident } from 'src/domain/resident';
import { DocumentSubmissionResponse, EvidenceRequestResponse } from 'types/api';
import { ResponseMapper } from '../boundary/response-mapper';

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
  private client: AxiosInstance;

  constructor() {
    this.client = Axios.create({ baseURL: process.env.RUNTIME_APP_URL });
  }

  async createEvidenceRequest(
    payload: EvidenceRequestRequest
  ): Promise<EvidenceRequest> {
    try {
      const { data } = await this.client.post<EvidenceRequestResponse>(
        '/api/evidence/evidence_requests',
        payload
      );

      return ResponseMapper.mapEvidenceRequest(data);
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
      const { data } = await this.client.patch<DocumentSubmissionResponse>(
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
