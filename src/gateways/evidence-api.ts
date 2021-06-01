import Axios, { AxiosInstance, Method } from 'axios';
import {
  DocumentSubmissionResponse,
  EvidenceRequestResponse,
  ResidentResponse,
  TokenDictionary,
} from '../../types/api';
import { InternalServerError } from './internal-api';
import { IDocumentType } from 'src/domain/document-type';
import { ResponseMapper } from 'src/boundary/response-mapper';
import {
  DocumentSubmission,
  IDocumentSubmission,
} from 'src/domain/document-submission';
import { EvidenceRequest } from 'src/domain/evidence-request';
import { DocumentType } from 'src/domain/document-type';
import { EvidenceRequestState } from 'src/domain/enums/EvidenceRequestState';
import { Resident } from 'src/domain/resident';
import https from 'https';

const tokens: TokenDictionary = {
  document_types: {
    GET: process.env.EVIDENCE_API_TOKEN_DOCUMENT_TYPES_GET,
  },
  evidence_requests: {
    GET: process.env.EVIDENCE_API_TOKEN_EVIDENCE_REQUESTS_GET,
    POST: process.env.EVIDENCE_API_TOKEN_EVIDENCE_REQUESTS_POST,
  },
  document_submissions: {
    GET: process.env.EVIDENCE_API_TOKEN_DOCUMENT_SUBMISSIONS_GET,
    PATCH: process.env.EVIDENCE_API_TOKEN_DOCUMENT_SUBMISSIONS_PATCH,
  },
  residents: {
    GET: process.env.EVIDENCE_API_TOKEN_RESIDENTS_GET,
  },
};

type EvidenceApiGatewayDependencies = {
  client: AxiosInstance;
};

const defaultDependencies: EvidenceApiGatewayDependencies = {
  client: Axios.create({
    baseURL: process.env.EVIDENCE_API_BASE_URL,
    httpsAgent: new https.Agent({
      cert: process.env.PALO_ALTOS_SSL_CERTIFICATE,
    }),
  }),
};

export class EvidenceApiGateway {
  private client: AxiosInstance;

  constructor({ client } = defaultDependencies) {
    this.client = client;
  }

  async getEvidenceRequests(
    userEmail: string,
    teamName: string,
    state?: EvidenceRequestState | null
  ): Promise<EvidenceRequest[]> {
    try {
      const { data } = await this.client.get<EvidenceRequestResponse[]>(
        '/api/v1/evidence_requests',
        {
          headers: {
            Authorization: tokens?.evidence_requests?.GET,
            UserEmail: userEmail,
          },
          params: { serviceRequestedBy: teamName, state: state },
        }
      );

      return data.map((er) => ResponseMapper.mapEvidenceRequest(er));
    } catch (err) {
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }

  async getDocumentTypes(
    userEmail: string,
    teamName: string
  ): Promise<DocumentType[]> {
    try {
      const { data } = await this.client.get<IDocumentType[]>(
        `/api/v1/document_types/${teamName}`,
        {
          headers: {
            Authorization: tokens?.document_types?.GET,
            UserEmail: userEmail,
          },
        }
      );
      return data.map(ResponseMapper.mapDocumentType);
    } catch (err) {
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }

  async getStaffSelectedDocumentTypes(
    userEmail: string,
    teamName: string
  ): Promise<DocumentType[]> {
    try {
      const { data } = await this.client.get<IDocumentType[]>(
        `/api/v1/document_types/staff_selected/${teamName}`,
        {
          headers: {
            Authorization: tokens?.document_types?.GET,
            UserEmail: userEmail,
          },
        }
      );
      return data.map(ResponseMapper.mapDocumentType);
    } catch (err) {
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }

  async getEvidenceRequest(
    userEmail: string,
    id: string
  ): Promise<EvidenceRequest> {
    try {
      const { data } = await this.client.get<EvidenceRequestResponse>(
        `/api/v1/evidence_requests/${id}`,
        {
          headers: {
            Authorization: tokens?.evidence_requests?.GET,
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

  async updateDocumentSubmission(
    userEmail: string,
    documentSubmissionId: string,
    params: Partial<IDocumentSubmission>
  ): Promise<DocumentSubmission> {
    try {
      const { data } = await this.client.patch<DocumentSubmissionResponse>(
        `/api/v1/document_submissions/${documentSubmissionId}`,
        params,
        {
          headers: {
            Authorization: tokens?.document_submissions?.PATCH,
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

  async getDocumentSubmission(
    userEmail: string,
    id: string
  ): Promise<DocumentSubmission> {
    try {
      const { data } = await this.client.get<DocumentSubmissionResponse>(
        `/api/v1/document_submissions/${id}`,
        {
          headers: {
            Authorization: tokens?.document_submissions?.GET,
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

  async getDocumentSubmissionsForResident(
    userEmail: string,
    serviceRequestedBy: string,
    residentId: string
  ): Promise<DocumentSubmission[]> {
    try {
      const { data } = await this.client.get<DocumentSubmissionResponse[]>(
        '/api/v1/document_submissions',
        {
          headers: {
            Authorization: tokens?.document_submissions?.GET,
            UserEmail: userEmail,
          },
          params: {
            serviceRequestedBy: serviceRequestedBy,
            residentId: residentId,
          },
        }
      );
      return data.map((ds) => ResponseMapper.mapDocumentSubmission(ds));
    } catch (err) {
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }

  async getResident(userEmail: string, residentId: string): Promise<Resident> {
    try {
      const { data } = await this.client.get<ResidentResponse>(
        `/api/v1/residents/${residentId}`,
        {
          headers: {
            Authorization: tokens?.residents?.GET,
            UserEmail: userEmail,
          },
          params: {
            residentId: residentId,
          },
        }
      );
      return ResponseMapper.mapResidentResponse(data);
    } catch (err) {
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }

  async request(
    pathSegments: string[],
    method: Method,
    headers: unknown,
    body?: unknown,
    params?: unknown
  ): Promise<{ data?: string; status: number }> {
    const token = this.getToken(pathSegments, method);
    const headerDictionary: TokenDictionary = JSON.parse(
      JSON.stringify(headers)
    );
    const userEmail = headerDictionary['useremail'];

    try {
      const { status, data } = await this.client.request({
        method,
        url: `/api/v1/${pathSegments.join('/')}`,
        data: body,
        params: params,
        headers: {
          Authorization: token,
          UserEmail: userEmail,
        },
        validateStatus() {
          return true;
        },
      });

      return { data, status };
    } catch (err) {
      console.log(err);
      return { status: 500 };
    }
  }

  private getToken(path: string[], method: Method) {
    const firstPathSegment = path[0];
    const methods = tokens[firstPathSegment];
    if (methods) return methods[method];
  }
}
