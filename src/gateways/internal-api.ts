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
  uploadLinkCheckbox: [];
  noteToResident: string;
}

export interface DocumentSubmissionWithoutEvidenceRequestRequest {
  residentId: string;
  team: string;
  userCreatedBy: string;
  staffSelectedDocumentTypeId: string;
  documentDescription: string;
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

export interface CreateResidentRequest {
  name: string;
  email: string | null;
  phoneNumber: string | null;
  groupId: string | null;
}

export interface ResidentRequest {
  team?: string | null;
  searchQuery?: string | null;
  groupId?: string | null;
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

  async createResident(
    userEmail: string,
    team: string,
    payload: CreateResidentRequest
  ): Promise<Resident> {
    try {
      const { data } = await this.client.post<ResidentResponse>(
        '/api/evidence/residents',
        { ...payload, team },
        {
          headers: {
            UserEmail: userEmail,
          },
        }
      );
      return ResponseMapper.mapResidentResponse(data);
    } catch (err) {
      if (err.response) {
        console.error(err);
        throw err.response.data;
      }
      throw new InternalServerError('Internal server error');
    }
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

  async createDocumentSubmissionWithoutEvidenceRequest(
    userEmail: string,
    params: DocumentSubmissionWithoutEvidenceRequestRequest
  ): Promise<DocumentSubmission> {
    try {
      const { data } = await this.client.post<DocumentSubmissionResponse>(
        `/api/evidence/document_submissions`,
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
    pageSize: string,
    state?: string
  ): Promise<DocumentSubmissionsObject> {
    try {
      const { data } = await this.client.get<DocumentSubmissionsObject>(
        `/api/document_submissions/${residentId}`,
        {
          params: {
            residentId,
            team,
            state,
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

  async mergeAndLinkResident(
    userEmail: string,
    team: string,
    groupId: string,
    residentName: string,
    residentEmail: string,
    residentPhone: string,
    residentsToDelete: string[]
  ): Promise<{ resident: Resident; groupId: string }> {
    const requestBody = {
      team: team,
      groupId: groupId,
      newResident: {
        name: residentName,
        email: residentEmail,
        phoneNumber: residentPhone,
      },
      residentsToDelete: residentsToDelete,
    };

    try {
      const { data } = await this.client.post<{
        resident: Resident;
        groupId: string;
      }>('/api/evidence/residents/merge-and-link', requestBody, {
        headers: {
          UserEmail: userEmail,
        },
      });
      return data;
    } catch (err) {
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }
}
