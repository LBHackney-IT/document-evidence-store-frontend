import axios, { Method } from 'axios';

type TokenDictionary = {
  [key: string]:
    | {
        [method: string]: string | undefined;
      }
    | undefined;
};

const tokens: TokenDictionary = {
  document_types: {
    GET: process.env.EVIDENCE_API_TOKEN_DOCUMENT_TYPES_GET,
  },
  evidence_requests: {
    GET: process.env.EVIDENCE_API_TOKEN_EVIDENCE_REQUESTS_GET,
    POST: process.env.EVIDENCE_API_TOKEN_EVIDENCE_REQUESTS_POST,
  },
};

export class EvidenceApiGateway {
  async request(
    pathSegments: string[],
    method: Method,
    body?: unknown
  ): Promise<{ data?: string; status: number }> {
    const token = this.getToken(pathSegments, method);
    if (!token) {
      return { status: 404 };
    }

    try {
      const { status, data } = await axios.request({
        method,
        baseURL: process.env.BASE_URL,
        url: `/${pathSegments.join('/')}`,
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
