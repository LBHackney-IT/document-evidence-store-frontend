import { Method } from 'axios';

export const requestMock = jest.fn();

export const EvidenceApiGateway = jest.fn().mockImplementation(() => ({
  request: requestMock,
}));
