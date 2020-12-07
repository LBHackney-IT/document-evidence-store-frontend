import { NextApiRequest, NextApiResponse } from 'next';
import { mocked } from 'ts-jest/utils';
import { requestMock } from '../../../gateways/evidence-api';
import endpoint from './[...path]';
import { authoriseUser, User } from '../../../helpers/auth';

jest.mock('../../../gateways/evidence-api');
jest.mock('../../../helpers/auth');

const mockedAuthoriseUser = mocked(authoriseUser);
describe('endpoint', () => {
  const req = ({
    method: 'GET',
    query: { path: ['foo'] },
  } as unknown) as NextApiRequest;

  const res = ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown) as NextApiResponse;

  describe('returns 200', () => {
    const expectedData = 'foo';
    const expectedStatus = 200;
    it('returns the correct response for successful GET', async () => {
      mockedAuthoriseUser.mockReturnValue({} as User);
      requestMock.mockResolvedValue({
        status: expectedStatus,
        data: expectedData,
      });

      await endpoint(req, res);
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedData);
    });

    it('returns the correct response for successful POST', async () => {
      mockedAuthoriseUser.mockReturnValue({} as User);
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
      mockedAuthoriseUser.mockReturnValue({} as User);
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
      mockedAuthoriseUser.mockReturnValue({} as User);
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
    const expectedData = { error: 'Unauthorised' };
    const expectedStatus = 401;
    it('returns an error when the user is not authenticated', async () => {
      mockedAuthoriseUser.mockReturnValue(undefined);
      await endpoint(req, res);
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedData);
    });
  });
});
