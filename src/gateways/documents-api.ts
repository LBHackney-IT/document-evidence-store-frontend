import Axios, { AxiosInstance } from 'axios';
import { TokenDictionary } from '../../types/api';
import { InternalServerError } from './internal-api';

const tokens: TokenDictionary = {
  claims: {
    GET: process.env.DOCUMENTS_API_GET_CLAIMS_TOKEN,
  },
  documents: {
    GET: process.env.DOCUMENTS_API_GET_DOCUMENTS_TOKEN,
  },
};

type DocumentsApiGatewayDependencies = {
  client: AxiosInstance;
};

const defaultDependencies: DocumentsApiGatewayDependencies = {
  client: Axios.create({ baseURL: process.env.DOCUMENTS_API_BASE_URL }),
};

export class DocumentsApiGateway {
  private client: AxiosInstance;

  constructor({ client } = defaultDependencies) {
    this.client = client;
  }

  async getDocument(documentId: string): Promise<ArrayBuffer> {
    try {
      const { data } = await this.client.get<ArrayBuffer>(
        `/api/v1/claims/${documentId}/download`,
        {
          headers: { Authorization: tokens?.claims?.GET },
          responseType: 'arraybuffer',
        }
      );
      return data;
    } catch (err) {
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }
}
