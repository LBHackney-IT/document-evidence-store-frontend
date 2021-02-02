import Axios, { AxiosInstance, Method } from 'axios';
import {
  DocumentSubmissionResponse,
  EvidenceRequestResponse,
  TokenDictionary,
} from '../../types/api';
import { InternalServerError } from './internal-api';
import EvidenceRequestsFixture from '../../cypress/fixtures/evidence_requests/index.json';
import { IDocumentType } from 'src/domain/document-type';
import { ResponseMapper } from 'src/boundary/response-mapper';
import { DocumentSubmission } from 'src/domain/document-submission';
import { EvidenceRequest } from 'src/domain/evidence-request';
import { DocumentType } from 'src/domain/document-type';

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

  async getEvidenceRequests(): Promise<EvidenceRequest[]> {
    try {
      // TODO: Uncomment when endpoint is complete on API
      // const { data } = await this.client.get<EvidenceRequestResponse[]>(
      //   '/evidence_requests'
      // );
      await new Promise((resolve) => setTimeout(resolve, 100));
      const data = EvidenceRequestsFixture;

      return data.map(ResponseMapper.mapEvidenceRequest);
    } catch (err) {
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }

  async getDocumentTypes(): Promise<DocumentType[]> {
    try {
      const { data } = await this.client.get<IDocumentType[]>(
        '/document_types',
        { headers: { Authorization: tokens?.document_types?.GET } }
      );
      return data.map(ResponseMapper.mapDocumentType);
    } catch (err) {
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }

  async getEvidenceRequest(id: string): Promise<EvidenceRequest> {
    try {
      const { data } = await this.client.get<EvidenceRequestResponse>(
        `/evidence_requests/${id}`,
        { headers: { Authorization: tokens?.evidence_requests?.GET } }
      );
      return ResponseMapper.mapEvidenceRequest(data);
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
      const { data } = await this.client.post<DocumentSubmissionResponse>(
        `/evidence_requests/${evidenceRequestId}/document_submissions`,
        { documentType },
        { headers: { Authorization: tokens?.document_submissions?.POST } }
      );
      return ResponseMapper.mapDocumentSubmission(data);
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
