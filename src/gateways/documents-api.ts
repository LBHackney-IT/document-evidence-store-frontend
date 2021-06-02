import Axios, { AxiosInstance } from 'axios';
import { TokenDictionary } from '../../types/api';
import { InternalServerError } from './internal-api';

const tokens: TokenDictionary = {
  claims: {
    GET: process.env.DOCUMENTS_API_GET_CLAIMS_TOKEN,
    POST: process.env.DOCUMENTS_API_POST_CLAIMS_TOKEN,
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

  async generateDownloadUrl(
    claimId: string,
    documentId: string
  ): Promise<string> {
    try {
      const { data } = await this.client.post<string>(
        `/api/v1/claims/${claimId}/download_links`,
        { documentId },
        { headers: { Authorization: tokens?.claims?.POST } }
      );
      return data;
    } catch (err) {
      console.error(err);
      throw new InternalServerError('Internal server error');
    }
  }
}
