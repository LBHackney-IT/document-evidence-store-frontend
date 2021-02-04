import { AxiosInstance, AxiosResponse } from 'axios';
import { ResponseMapper } from 'src/boundary/response-mapper';
import {
  DocumentState,
  DocumentSubmission,
} from 'src/domain/document-submission';
import { DocumentSubmissionResponse } from 'types/api';
import DocumentSubmissionFixture from '../../cypress/fixtures/document_submissions/id.json';
import EvidenceRequestFixture from '../../cypress/fixtures/evidence_requests/index.json';
import { EvidenceApiGateway } from './evidence-api';
import { InternalServerError } from './internal-api';

jest.mock('../boundary/response-mapper');
const mockedResponseMapper = ResponseMapper as jest.Mocked<
  typeof ResponseMapper
>;

const client = {
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  request: jest.fn(),
};

describe('Evidence api gateway', () => {
  const gateway = new EvidenceApiGateway({
    client: (client as unknown) as AxiosInstance,
  });
  const validateStatus = expect.any(Function);

  describe('GET request to /document_types', () => {
    const expectedData = {
      key: 'response to GET',
    };
    const expectedStatus = 200;
    const expectedResponse = {
      data: expectedData,
      status: expectedStatus,
    };
    const path = ['document_types'];
    const method = 'GET';

    beforeEach(() => {
      client.request.mockImplementation(
        async () =>
          ({
            data: expectedData,
            status: expectedStatus,
          } as AxiosResponse)
      );
    });

    it('the request returns the correct response', async () => {
      const response = await gateway.request(path, method);
      expect(response).toEqual(expectedResponse);
      expect(client.request).toHaveBeenCalledWith({
        method,
        url: `/api/v1/${path.join('/')}`,
        data: undefined,
        validateStatus,
        headers: {
          Authorization: process.env.EVIDENCE_API_TOKEN_DOCUMENT_TYPES_GET,
        },
      });
    });
  });

  describe('POST request to /evidence_requests', () => {
    const path = ['evidence_requests'];
    const method = 'POST';
    const body = {
      data: 'bar',
    };
    const expectedData = 'response to POST';
    const expectedStatus = 200;
    const expectedResponse = { data: expectedData, status: expectedStatus };

    beforeEach(() => {
      client.request.mockImplementation(
        async () =>
          ({
            data: expectedData,
            status: expectedStatus,
          } as AxiosResponse)
      );
    });

    it('the request returns the correct response', async () => {
      const response = await gateway.request(path, method, body);
      expect(response).toEqual(expectedResponse);
      expect(client.request).toHaveBeenCalledWith({
        method,
        url: `/api/v1/${path.join('/')}`,
        data: body,
        headers: {
          Authorization: process.env.EVIDENCE_API_TOKEN_EVIDENCE_REQUESTS_POST,
        },
        validateStatus,
      });
    });
  });

  describe('when request fails', () => {
    const path = ['evidence_requests'];
    const method = 'POST';
    const expectedData = 'error details';
    const expectedStatus = 400;
    const expectedResponse = { data: expectedData, status: expectedStatus };

    beforeEach(() => {
      client.request.mockImplementation(
        async () =>
          ({
            data: expectedData,
            status: expectedStatus,
          } as AxiosResponse)
      );
    });

    it('does not throw an error', async () => {
      const response = await gateway.request(path, method);
      expect(response).toEqual(expectedResponse);
    });

    describe('when axios request fails', () => {
      const expectedStatus = 500;
      const expectedResponse = { status: 500 };
      beforeEach(() => {
        client.request.mockRejectedValue({
          status: expectedStatus,
        } as AxiosResponse);
      });

      it('returns status code 500', async () => {
        const response = await gateway.request(path, method);
        expect(response).toEqual(expectedResponse);
      });
    });
  });

  describe('for a nested path', () => {
    const path = ['evidence_requests', '0123456'];
    const expectedStatus = 200;
    const expectedData = { foo: 'bar' };
    const expectedResponse = {
      data: expectedData,
      status: expectedStatus,
    };
    const method = 'GET';

    beforeEach(() => {
      client.request.mockImplementation(
        async () =>
          ({
            data: expectedData,
            status: expectedStatus,
          } as AxiosResponse)
      );
    });

    it('returns the correct response', async () => {
      const response = await gateway.request(path, method);
      expect(response).toEqual(expectedResponse);
      expect(client.request).toHaveBeenCalledWith({
        method,
        url: `/api/v1/${path.join('/')}`,
        data: undefined,
        validateStatus,
        headers: {
          Authorization: process.env.EVIDENCE_API_TOKEN_EVIDENCE_REQUESTS_GET,
        },
      });
    });
  });

  xdescribe('getEvidenceRequests', () => {
    describe('returns the correct response', () => {
      const expectedData = EvidenceRequestFixture;
      const mappedData = EvidenceRequestFixture.map(
        ResponseMapper.mapEvidenceRequest
      );

      beforeEach(() => {
        client.get.mockResolvedValue({
          data: expectedData,
        } as AxiosResponse);

        mockedResponseMapper.mapEvidenceRequest
          .mockReturnValueOnce(mappedData[0])
          .mockReturnValueOnce(mappedData[1]);
      });

      it('calls axios correctly', async () => {
        await gateway.getEvidenceRequests();
        expect(client.get).toHaveBeenLastCalledWith(
          '/api/v1/evidence_requests'
        );
      });

      it('maps the response', async () => {
        await gateway.getEvidenceRequests();
        for (let i = 0; i < expectedData.length; i++) {
          expect(
            mockedResponseMapper.mapEvidenceRequest
          ).toHaveBeenNthCalledWith(i + 1, expectedData[i]);
        }
      });

      it('returns mapped EvidenceTypes', async () => {
        const result = await gateway.getEvidenceRequests();
        expect(result).toEqual(mappedData);
      });
    });

    describe('when there is an error', () => {
      it('returns internal server error', async () => {
        client.get.mockRejectedValue(new Error('Network error'));
        const functionCall = () => gateway.getEvidenceRequests();
        expect(functionCall).rejects.toEqual(
          new InternalServerError('Internal server error')
        );
      });
    });
  });

  describe('getEvidenceRequest', () => {
    const id = 'id';
    describe('returns the correct response', () => {
      const expectedData = EvidenceRequestFixture[0];
      const mappedData = ResponseMapper.mapEvidenceRequest(expectedData);

      beforeEach(() => {
        client.get.mockResolvedValue({
          data: expectedData,
        });

        mockedResponseMapper.mapEvidenceRequest.mockReturnValue(mappedData);
      });

      it('calls axios correctly', async () => {
        await gateway.getEvidenceRequest(id);
        expect(client.get).toHaveBeenLastCalledWith(
          `/api/v1/evidence_requests/${id}`,
          {
            headers: {
              Authorization:
                process.env.EVIDENCE_API_TOKEN_EVIDENCE_REQUESTS_GET,
            },
          }
        );
      });

      it('maps the response', async () => {
        await gateway.getEvidenceRequest(id);
        expect(mockedResponseMapper.mapEvidenceRequest).toHaveBeenCalledWith(
          expectedData
        );
      });

      it('returns mapped EvidenceTypes', async () => {
        const result = await gateway.getEvidenceRequest(id);
        expect(result).toEqual(mappedData);
      });
    });

    describe('when there is an error', () => {
      it('returns internal server error', async () => {
        client.get.mockRejectedValue(new Error('Network error'));
        const functionCall = () => gateway.getEvidenceRequest(id);
        expect(functionCall).rejects.toEqual(
          new InternalServerError('Internal server error')
        );
      });
    });
  });

  describe('createDocumentSubmission', () => {
    const documentType = 'passport-scan';
    const evidenceRequestId = 'evidence request id';

    describe('when there is an error', () => {
      it('returns internal server error', async () => {
        client.post.mockRejectedValue(new Error('Internal server error'));
        const functionCall = () =>
          gateway.createDocumentSubmission(evidenceRequestId, documentType);
        await expect(functionCall).rejects.toEqual(
          new InternalServerError('Internal server error')
        );
      });
    });

    describe('when successful', () => {
      const mappedResponse = ResponseMapper.mapDocumentSubmission(
        DocumentSubmissionFixture
      );

      beforeEach(() => {
        client.post.mockResolvedValue({ data: DocumentSubmissionFixture });
        mockedResponseMapper.mapDocumentSubmission.mockReturnValue(
          mappedResponse
        );
      });

      it('calls axios correctly', async () => {
        await gateway.createDocumentSubmission(evidenceRequestId, documentType);
        expect(client.post).toHaveBeenCalledWith(
          `/api/v1/evidence_requests/${evidenceRequestId}/document_submissions`,
          {
            documentType,
          },
          {
            headers: {
              Authorization:
                process.env.EVIDENCE_API_TOKEN_EVIDENCE_REQUESTS_POST,
            },
          }
        );
      });

      it('maps the response correctly', async () => {
        await gateway.createDocumentSubmission(evidenceRequestId, documentType);
        expect(mockedResponseMapper.mapDocumentSubmission).toHaveBeenCalledWith(
          DocumentSubmissionFixture
        );
      });

      it('returns the correct response', async () => {
        const result = await gateway.createDocumentSubmission(
          evidenceRequestId,
          documentType
        );
        expect(result).toEqual(mappedResponse);
      });
    });
  });

  describe('updateDocumentSubmission', () => {
    const documentSubmissionId = 'document submission id';
    const apiResponse = {} as DocumentSubmissionResponse;
    const expectedResult = {} as DocumentSubmission;

    describe('when successful', () => {
      beforeEach(() => {
        client.patch.mockResolvedValue({
          data: apiResponse,
        });

        mockedResponseMapper.mapDocumentSubmission.mockReturnValue(
          expectedResult
        );
      });

      it('makes the api request', async () => {
        await gateway.updateDocumentSubmission(documentSubmissionId, {
          state: DocumentState.UPLOADED,
        });

        expect(client.patch).toHaveBeenCalledWith(
          `/api/v1/document_submissions/${documentSubmissionId}`,
          { state: 'UPLOADED' },
          {
            headers: {
              Authorization:
                process.env.EVIDENCE_API_TOKEN_DOCUMENT_SUBMISSIONS_PATCH,
            },
          }
        );
      });

      it('returns the updated model', async () => {
        const result = await gateway.updateDocumentSubmission(
          documentSubmissionId,
          {
            state: DocumentState.UPLOADED,
          }
        );

        expect(result).toBe(expectedResult);
      });
    });

    describe('when there is an error', () => {
      it('returns internal server error', async () => {
        client.patch.mockRejectedValue(new Error('Internal server error'));
        const functionCall = () =>
          gateway.updateDocumentSubmission(documentSubmissionId, {
            state: DocumentState.UPLOADED,
          });
        await expect(functionCall).rejects.toEqual(
          new InternalServerError('Internal server error')
        );
      });
    });
  });
});
