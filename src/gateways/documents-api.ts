import Axios, { AxiosInstance } from 'axios';
import { TokenDictionary } from '../../types/api';
import { InternalServerError } from './internal-api';

const tokens: TokenDictionary = {
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

  async getDocument(documentId: string): Promise<File> {
    try {
      const { data } = await this.client.get<File>(
        `/api/v1/documents/${documentId}`,
        { headers: { Authorization: tokens?.documents?.GET } }
      );
      return data;
    } catch (err) {
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }
}
