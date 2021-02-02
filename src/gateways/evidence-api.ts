import Axios, { AxiosInstance, Method } from 'axios';
import {
  DocumentSubmissionResponse,
  EvidenceRequestResponse,
  TokenDictionary,
} from '../../types/api';
import { InternalServerError } from './internal-api';
import EvidenceRequestsFixture from '../../cypress/fixtures/evidence-request-response.json';
import { IDocumentType } from 'src/domain/document-type';

const tokens: TokenDictionary = {
  document_types: {
    GET: process.env.EVIDENCE_API_TOKEN_DOCUMENT_TYPES_GET,
  },
  evidence_requests: {
    GET: process.env.EVIDENCE_API_TOKEN_EVIDENCE_REQUESTS_GET,
    POST: process.env.EVIDENCE_API_TOKEN_EVIDENCE_REQUESTS_POST,
    PATCH: process.env.EVIDENCE_API_TOKEN_EVIDENCE_REQUESTS_PATCH,
  },
  document_submissions: {
    POST: process.env.EVIDENCE_API_TOKEN_DOCUMENT_SUBMISSIONS_POST,
  },
};

export class EvidenceApiGateway {
  private client: AxiosInstance;

  constructor() {
    this.client = Axios.create({ baseURL: process.env.EVIDENCE_API_BASE_URL });
  }

  async getEvidenceRequests(): Promise<EvidenceRequestResponse[]> {
    try {
      // TODO: Uncomment when endpoint is complete on API
      // const { data } = await this.client.get<EvidenceRequestResponse[]>(
      //   '/evidence_requests'
      // );
      await new Promise((resolve) => setTimeout(resolve, 100));
      const data = EvidenceRequestsFixture;

      return data;
    } catch (err) {
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }

  async getDocumentTypes(): Promise<IDocumentType[]> {
    try {
      const { data } = await this.client.get<IDocumentType[]>(
        '/document_types',
        { headers: { Authorization: tokens?.document_types?.GET } }
      );
      return data;
    } catch (err) {
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }

  async getEvidenceRequest(id: string): Promise<EvidenceRequestResponse> {
    try {
      const { data } = await this.client.get<EvidenceRequestResponse>(
        `/evidence_requests/${id}`,
        { headers: { Authorization: tokens?.evidence_requests?.GET } }
      );
      return data;
    } catch (err) {
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }

  async createDocumentSubmission(
    evidenceRequestId: string,
    documentType: string
  ): Promise<DocumentSubmissionResponse> {
    try {
      const { data } = await this.client.post<DocumentSubmissionResponse>(
        `/evidence_requests/${evidenceRequestId}/document_submissions`,
        { documentType },
        { headers: { Authorization: tokens?.document_submissions?.POST } }
      );
      return data;
    } catch (err) {
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }

  async request(
    pathSegments: string[],
    method: Method,
    body?: unknown
  ): Promise<{ data?: string; status: number }> {
    const token = this.getToken(pathSegments, method);

    try {
      const { status, data } = await Axios.request({
        method,
        baseURL: process.env.EVIDENCE_API_BASE_URL,
        url: `/api/v1/${pathSegments.join('/')}`,
        data: body,
        headers: {
          Authorization: token,
        },
        validateStatus() {
          return true;
        },
      });

      return { data, status };
    } catch (err) {
      console.log('Error: ' + err);
      return { status: 500 };
    }
  }

  private getToken(path: string[], method: Method) {
    const firstPathSegment = path[0];
    const methods = tokens[firstPathSegment];
    if (methods) return methods[method];
  }
}
