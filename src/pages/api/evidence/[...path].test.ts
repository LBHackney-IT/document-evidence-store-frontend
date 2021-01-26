import { NextApiRequest, NextApiResponse } from 'next';
import * as EvidenceApi from '../../../gateways/evidence-api';
import * as EvidenceApiMock from '../../../gateways/__mocks__/evidence-api';
import * as RequestAuthorizer from '../../../services/request-authorizer';
import * as MockRequestAuthorizer from '../../../services/__mocks__/request-authorizer';
import endpoint from './[...path]';
import { User } from '../../../domain/user';

jest.mock('../../../gateways/evidence-api');
jest.mock('../../../services/request-authorizer');

const { requestMock } = EvidenceApi as typeof EvidenceApiMock;
const {
  executeMock,
} = (RequestAuthorizer as unknown) as typeof MockRequestAuthorizer;

describe('endpoint', () => {
  const cookieHeader = 'cookie header';
  const req = ({
    method: 'GET',
    query: { path: ['foo'] },
    headers: { cookie: cookieHeader },
  } as unknown) as NextApiRequest;

  const res = ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown) as NextApiResponse;

  describe('returns 200', () => {
    const expectedData = 'foo';
    const expectedStatus = 200;
    it('returns the correct response for successful GET', async () => {
      executeMock.mockReturnValue({ success: true, user: {} as User });
      requestMock.mockResolvedValue({
        status: expectedStatus,
        data: expectedData,
      });

      await endpoint(req, res);
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedData);
    });

    it('returns the correct response for successful POST', async () => {
      executeMock.mockReturnValue({ success: true, user: {} as User });
      requestMock.mockResolvedValue({
        status: expectedStatus,
        data: expectedData,
      });

      await endpoint(req, res);
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedData);
    });
  });

  describe('returns 400 bad request', () => {
    const expectedData = 'foo';
    const expectedStatus = 400;

    it('returns a 400 status when the request was unsuccessful', async () => {
      executeMock.mockReturnValue({ success: true, user: {} as User });
      requestMock.mockResolvedValue({
        status: expectedStatus,
        data: expectedData,
      });

      await endpoint(req, res);
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedData);
    });
  });

  describe('returns 500 internal server error', () => {
    const expectedData = { error: 'Server error' };
    const expectedStatus = 500;
    it('returns 500 when there was an error', async () => {
      executeMock.mockReturnValue({ success: true, user: {} as User });
      requestMock.mockRejectedValue({
        status: expectedStatus,
        data: expectedData,
      });
      await endpoint(req, res);
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedData);
    });
  });

  describe('returns 401 not authorised', () => {
    const error = 'oh noes';
    const expectedData = { error };
    const expectedStatus = 401;
    it('returns an error when the user is not authenticated', async () => {
      executeMock.mockReturnValue({ success: false, error });
      await endpoint(req, res);
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedData);
    });
  });
});
