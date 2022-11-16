import Axios, { AxiosInstance } from 'axios';
import {
  DocumentSubmission,
  DocumentSubmissionsObject,
} from 'src/domain/document-submission';
import { EvidenceRequest } from 'src/domain/evidence-request';
import { IResident, Resident } from 'src/domain/resident';
import {
  DocumentSubmissionResponse,
  EvidenceRequestResponse,
  ResidentResponse,
} from 'types/api';
import { ResponseMapper } from '../boundary/response-mapper';
import { EvidenceRequestState } from 'src/domain/enums/EvidenceRequestState';

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
  notificationEmail?: string;
  noteToResident: string;
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
  noteToResident: string;
}

export interface DocumentSubmissionRequest {
  documentType: string;
}

export interface DocumentSubmissionUpdateRequest {
  state: string;
  userUpdatedBy: string;
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
      if (err.response) {
        console.error(err);
        throw err.response.data;
      }
      throw new InternalServerError('Internal server error');
    }
  }

  async createDocumentSubmission(
    userEmail: string,
    evidenceRequestId: string,
    params: DocumentSubmissionRequest
  ): Promise<DocumentSubmission> {
    try {
      const { data } = await this.client.post<DocumentSubmissionResponse>(
        `/api/evidence/evidence_requests/${evidenceRequestId}/document_submissions`,
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
      if (err.response) {
        console.error(err);
        throw err.response.data;
      }
      throw new InternalServerError('Internal server error');
    }
  }

  async getDocumentSubmissions(
    userEmail: string,
    residentId: string,
    team: string,
    currentPage: string,
    pageSize: string
  ): Promise<DocumentSubmissionsObject> {
    try {
      const { data } = await this.client.get<DocumentSubmissionsObject>(
        `/api/document_submissions/${residentId}`,
        {
          params: {
            team,
            currentPage,
            pageSize,
          },
          headers: {
            userEmail: userEmail,
          },
        }
      );
      return data;
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

  async filterToReviewEvidenceRequests(
    userEmail: string,
    team: string,
    state?: EvidenceRequestState
  ): Promise<EvidenceRequest[]> {
    try {
      const { data } = await this.client.get<EvidenceRequestResponse[]>(
        '/api/evidence/evidence_requests',
        {
          params: { team, state },
          headers: {
            UserEmail: userEmail,
          },
        }
      );
      return data.map(ResponseMapper.mapEvidenceRequest);
    } catch (err) {
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }

  async sendUploadConfirmationNotificationToResidentAndStaff(
    userEmail: string,
    evidenceRequestId: string
  ): Promise<void> {
    try {
      await this.client.post<void>(
        `/api/evidence/evidence_requests/${evidenceRequestId}/confirmation`,
        null,
        {
          headers: {
            UserEmail: userEmail,
          },
        }
      );
    } catch (err) {
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }
}
