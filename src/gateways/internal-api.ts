import Axios, { AxiosInstance } from 'axios';
import { DocumentSubmission } from 'src/domain/document-submission';
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

export interface EvidenceRequestRequest {
  deliveryMethods: string[];
  documentTypes: string[];
  resident: Omit<IResident, 'id' | 'referenceId'>;
  team: string;
  reason: string;
  userRequestedBy?: string;
}

export interface EvidenceRequestForm {
  resident: {
    name: string;
    email: string;
    phoneNumber: string;
  };
  team: string;
  reason: string;
  documentTypes: [];
  emailCheckbox: [];
  phoneNumberCheckbox: [];
}

export interface DocumentSubmissionRequest {
  //documentType: string;
  document: FormData;
}

export interface DocumentSubmissionUpdateRequest {
  state: string;
  rejectionReason?: string;
  staffSelectedDocumentTypeId?: string;
  validUntil?: string;
}

export interface DocumentSubmissionUpdateForm {
  state: string;
  rejectionReason?: string;
  staffSelectedDocumentTypeId?: string;
  validUntilDates?: string[];
}

export interface ResidentRequest {
  team: string;
  searchQuery: string;
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
    userEmail: string,
    payload: EvidenceRequestRequest
  ): Promise<EvidenceRequest> {
    try {
      const { data } = await this.client.post<EvidenceRequestResponse>(
        '/api/evidence/evidence_requests',
        payload,
        {
          headers: {
            UserEmail: userEmail,
          },
        }
      );

      return ResponseMapper.mapEvidenceRequest(data);
    } catch (err) {
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }

  async createDocumentSubmission(
    userEmail: string,
    evidenceRequestId: string,
    document: FormData
  ): Promise<DocumentSubmission> {
    try {
      const { data } = await this.client.post<DocumentSubmissionResponse>(
        `http://localhost:3000/api/evidence/evidence_requests/161b095b-194a-4fe1-bde2-eafdafb82e13/document_submissions`,
        document,
        {
          headers: {
            UserEmail: userEmail,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return ResponseMapper.mapDocumentSubmission(data);
    } catch (err) {
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }

  async updateDocumentSubmission(
    userEmail: string,
    documentSubmissionId: string,
    params: DocumentSubmissionUpdateRequest
  ): Promise<DocumentSubmission> {
    try {
      const { data } = await this.client.patch<DocumentSubmissionResponse>(
        `/api/evidence/document_submissions/${documentSubmissionId}`,
        params,
        {
          headers: {
            UserEmail: userEmail,
          },
        }
      );
      return ResponseMapper.mapDocumentSubmission(data);
    } catch (err) {
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }

  async searchResidents(
    userEmail: string,
    params: ResidentRequest
  ): Promise<Resident[]> {
    try {
      const { data } = await this.client.get<ResidentResponse[]>(
        `/api/evidence/residents/search`,
        {
          params: params,
          headers: {
            UserEmail: userEmail,
          },
        }
      );
      return ResponseMapper.mapResidentResponseList(data);
    } catch (err) {
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }
}
