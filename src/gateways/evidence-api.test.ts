import { EvidenceApiGateway } from './evidence-api';
import axios, { AxiosResponse } from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Evidence api gateway', () => {
  const gateway = new EvidenceApiGateway();
  const validateStatus = expect.any(Function);
  const baseUrl = process.env.EVIDENCE_API_BASE_URL;

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
      mockedAxios.request.mockImplementation(
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
      expect(axios.request).toHaveBeenCalledWith({
        method,
        baseURL: baseUrl,
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
      mockedAxios.request.mockImplementation(
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
      expect(axios.request).toHaveBeenCalledWith({
        method,
        baseURL: baseUrl,
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
      mockedAxios.request.mockImplementation(
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
        mockedAxios.request.mockRejectedValue({
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
      mockedAxios.request.mockImplementation(
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
      expect(axios.request).toHaveBeenCalledWith({
        method,
        baseURL: baseUrl,
        url: `/api/v1/${path.join('/')}`,
        data: undefined,
        validateStatus,
        headers: {
          Authorization: process.env.EVIDENCE_API_TOKEN_EVIDENCE_REQUESTS_GET,
        },
      });
    });
  });
});
