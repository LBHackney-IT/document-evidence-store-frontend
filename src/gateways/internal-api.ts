import Axios, { AxiosInstance } from 'axios';
import {
  DocumentSubmission,
  IDocumentSubmission,
} from 'src/domain/document-submission';
import { EvidenceRequest } from 'src/domain/evidence-request';
import { IResident, Resident } from 'src/domain/resident';
import {
  DocumentSubmissionResponse,
  EvidenceRequestResponse,
  ResidentResponse,
} from 'types/api';
import { ResponseMapper } from '../boundary/response-mapper';

export class InternalServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InternalServerError';
  }
}

// It was recently that Service Area and Service were renamed to Team and Reason
// We have decided to keep serviceRequestedBy as it is for now, then later rename it to teamRequestedBy
export interface EvidenceRequestRequest {
  deliveryMethods: string[];
  documentTypes: string[];
  resident: Omit<IResident, 'id'>;
  serviceRequestedBy: string;
  reason: string;
  userRequestedBy?: string;
}

type InternalApiDependencies = {
  client: AxiosInstance;
};

/** See README.md for an explanation of this. */
export class InternalApiGateway {
  private client: AxiosInstance;

  constructor(
    { client }: InternalApiDependencies = { client: Axios.create() }
  ) {
    this.client = client;
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

  async searchResidents(searchQuery: string): Promise<Resident[]> {
    try {
      const { data } = await this.client.get<ResidentResponse[]>(
        `/api/evidence/residents/search/${searchQuery}`
      );
      return ResponseMapper.mapResidentResponseList(data);
    } catch (err) {
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }
}
