import Axios, { AxiosInstance, Method } from 'axios';
import {
  DocumentSubmissionResponse,
  DocumentSubmissionResponseObject,
  EvidenceRequestResponse,
  ResidentResponse,
  TokenDictionary,
} from '../../types/api';
import { InternalServerError } from './internal-api';
import { IDocumentType } from 'src/domain/document-type';
import { ResponseMapper } from 'src/boundary/response-mapper';
import {
  DocumentSubmission,
  DocumentSubmissionsObject,
} from 'src/domain/document-submission';
import { EvidenceRequest } from 'src/domain/evidence-request';
import { DocumentType } from 'src/domain/document-type';
import { EvidenceRequestState } from 'src/domain/enums/EvidenceRequestState';
import { Resident } from 'src/domain/resident';

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
    POST: process.env.EVIDENCE_API_TOKEN_DOCUMENT_SUBMISSIONS_POST,
  },
  residents: {
    GET: process.env.EVIDENCE_API_TOKEN_RESIDENTS_GET,
    POST: process.env.EVIDENCE_API_TOKEN_RESIDENTS_POST,
  },
};

const headersToSendToEvidenceApi = ['useremail', 'content-type'];

type EvidenceApiGatewayDependencies = {
  client: AxiosInstance;
};

const defaultDependencies: EvidenceApiGatewayDependencies = {
  client: Axios.create({ baseURL: process.env.EVIDENCE_API_BASE_URL }),
};

export class EvidenceApiGateway {
  private client: AxiosInstance;

  constructor({ client } = defaultDependencies) {
    this.client = client;
  }

  async getEvidenceRequests(
    userEmail: string,
    teamName: string,
    residentId?: string | null,
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
          params: { team: teamName, residentId: residentId, state: state },
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
    teamName: string,
    isEnabled?: boolean
  ): Promise<DocumentType[]> {
    try {
      const { data } = await this.client.get<IDocumentType[]>(
        `/api/v1/document_types/${teamName}?enabled=${isEnabled}`,
        {
          headers: {
            Authorization: tokens?.document_types?.GET,
            UserEmail: userEmail,
          },
        }
      );
      return data.map((dt) => ResponseMapper.mapDocumentType(dt));
    } catch (err) {
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }

  async getStaffSelectedDocumentTypes(
    userEmail: string,
    teamName: string,
    isEnabled?: boolean
  ): Promise<DocumentType[]> {
    try {
      const { data } = await this.client.get<IDocumentType[]>(
        `/api/v1/document_types/staff_selected/${teamName}?enabled=${isEnabled}`,
        {
          headers: {
            Authorization: tokens?.document_types?.GET,
            UserEmail: userEmail,
          },
        }
      );
      return data.map((er) => ResponseMapper.mapDocumentType(er));
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
    residentId: string,
    team: string,
    page: string,
    pageSize: string,
    state?: string
  ): Promise<DocumentSubmissionsObject> {
    try {
      const { data } = await this.client.get<DocumentSubmissionResponseObject>(
        '/api/v1/document_submissions',
        {
          headers: {
            Authorization: tokens?.document_submissions?.GET,
            UserEmail: userEmail,
          },
          params: {
            residentId: residentId,
            team: team,
            state: state,
            page: page,
            pageSize: pageSize,
          },
        }
      );
      return {
        total: data.total,
        documentSubmissions: data.documentSubmissions.map((ds) =>
          ResponseMapper.mapDocumentSubmission(ds)
        ),
      };
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
    const headerDictionary: TokenDictionary = JSON.parse(
      JSON.stringify(headers)
    );
    const requestHeaders = Object.keys(headerDictionary)
      .filter((key) => headersToSendToEvidenceApi.includes(key))
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: headerDictionary[key],
        };
      }, {});

    try {
      const { status, data } = await this.client.request({
        method,
        url: `/api/v1/${pathSegments.join('/')}`,
        data: body,
        params: params,
        headers: {
          ...requestHeaders,
          Authorization: this.getToken(pathSegments, method),
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
