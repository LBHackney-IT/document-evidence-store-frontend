import { AxiosInstance } from 'axios';
import { DocumentSubmissionResponse, ResidentResponse } from 'types/api';
import { ResponseMapper } from '../boundary/response-mapper';
import {
  DocumentState,
  DocumentSubmission,
} from '../domain/document-submission';
import {
  EvidenceRequestRequest,
  InternalApiGateway,
  InternalServerError,
} from './internal-api';
import { Resident } from '../domain/resident';
import { EvidenceRequest } from '../domain/evidence-request';
import { Constants } from '../helpers/Constants';

jest.mock('../boundary/response-mapper');
const mockedResponseMapper = ResponseMapper as jest.Mocked<
  typeof ResponseMapper
>;

const client = {
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
};

describe('Internal API Gateway', () => {
  const gateway = new InternalApiGateway({
    client: (client as unknown) as AxiosInstance,
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
        await gateway.updateDocumentSubmission(
          Constants.DUMMY_EMAIL,
          documentSubmissionId,
          {
            state: DocumentState.UPLOADED,
          }
        );

        expect(client.patch).toHaveBeenCalledWith(
          `/api/evidence/document_submissions/${documentSubmissionId}`,
          { params: { state: 'UPLOADED' } },
          { headers: { UserEmail: Constants.DUMMY_EMAIL } }
        );
      });

      it('returns the updated model', async () => {
        const result = await gateway.updateDocumentSubmission(
          Constants.DUMMY_EMAIL,
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
          gateway.updateDocumentSubmission(
            Constants.DUMMY_EMAIL,
            documentSubmissionId,
            {
              state: DocumentState.UPLOADED,
            }
          );
        await expect(functionCall).rejects.toEqual(
          new InternalServerError('Internal server error')
        );
      });
    });
  });

  describe('createDocumentSubmission', () => {
    const evidenceRequestId = 'evidence request id';
    const documentType = 'passport-scan';
    const apiResponse = {} as DocumentSubmission;
    const expectedResult = {} as DocumentSubmission;

    describe('when successful', () => {
      beforeEach(() => {
        client.post.mockResolvedValue({
          data: apiResponse,
        });

        mockedResponseMapper.mapDocumentSubmission.mockReturnValue(
          expectedResult
        );
      });

      it('makes the api request', async () => {
        await gateway.createDocumentSubmission(
          Constants.DUMMY_EMAIL,
          evidenceRequestId,
          documentType
        );

        expect(client.post).toHaveBeenCalledWith(
          `/api/evidence/evidence_requests/${evidenceRequestId}/document_submissions`,
          { documentType },
          { headers: { UserEmail: Constants.DUMMY_EMAIL } }
        );
      });

      it('returns the updated model', async () => {
        const result = await gateway.createDocumentSubmission(
          Constants.DUMMY_EMAIL,
          evidenceRequestId,
          documentType
        );

        expect(result).toBe(expectedResult);
      });
    });

    describe('when there is an error', () => {
      it('returns internal server error', async () => {
        client.post.mockRejectedValue(new Error('Internal server error'));
        const functionCall = () =>
          gateway.createDocumentSubmission(
            Constants.DUMMY_EMAIL,
            evidenceRequestId,
            documentType
          );
        await expect(functionCall).rejects.toEqual(
          new InternalServerError('Internal server error')
        );
      });
    });
  });

  describe('createEvidenceRequest', () => {
    const baseRequest: EvidenceRequestRequest = {
      documentTypes: ['passport'],
      deliveryMethods: [],
      resident: {
        name: 'Frodo',
        email: 'frodo@bagend.com',
        phoneNumber: '0123',
      },
      serviceRequestedBy: 'Example Service',
      reason: 'example-reason',
    };
    const apiResponse = {} as EvidenceRequest;
    const expectedResult = {} as EvidenceRequest;

    describe('when successful', () => {
      beforeEach(() => {
        client.post.mockResolvedValue({
          data: apiResponse,
        });

        mockedResponseMapper.mapEvidenceRequest.mockReturnValue(expectedResult);
      });

      it('makes the api request', async () => {
        await gateway.createEvidenceRequest(Constants.DUMMY_EMAIL, baseRequest);

        expect(client.post).toHaveBeenCalledWith(
          `/api/evidence/evidence_requests`,
          baseRequest,
          {
            headers: { UserEmail: Constants.DUMMY_EMAIL },
          }
        );
      });

      it('returns the updated model', async () => {
        const result = await gateway.createEvidenceRequest(
          Constants.DUMMY_EMAIL,
          baseRequest
        );

        expect(result).toBe(expectedResult);
      });
    });

    describe('when there is an error', () => {
      it('returns internal server error', async () => {
        client.post.mockRejectedValue(new Error('Internal server error'));
        const functionCall = () =>
          gateway.createEvidenceRequest(Constants.DUMMY_EMAIL, baseRequest);
        await expect(functionCall).rejects.toEqual(
          new InternalServerError('Internal server error')
        );
      });
    });
  });

  describe('searchResidents', () => {
    const searchQuery = 'test query';
    const apiResponse = {} as ResidentResponse[];
    const expectedResult = {} as Resident[];

    describe('when successful', () => {
      beforeEach(() => {
        client.get.mockResolvedValue({
          data: apiResponse,
        });

        mockedResponseMapper.mapResidentResponseList.mockReturnValue(
          expectedResult
        );
      });

      it('makes the api request', async () => {
        await gateway.searchResidents(Constants.DUMMY_EMAIL, {
          serviceRequestedBy: searchQuery,
          searchQuery: searchQuery,
        });

        expect(client.get).toHaveBeenCalledWith(
          `/api/evidence/residents/search`,
          {
            params: {
              serviceRequestedBy: searchQuery,
              searchQuery: searchQuery,
            },
            headers: { UserEmail: Constants.DUMMY_EMAIL },
          }
        );
      });

      it('returns the updated model', async () => {
        const result = await gateway.searchResidents(Constants.DUMMY_EMAIL, {
          serviceRequestedBy: searchQuery,
          searchQuery: searchQuery,
        });

        expect(result).toBe(expectedResult);
      });
    });

    describe('when there is an error', () => {
      it('returns internal server error', async () => {
        client.get.mockRejectedValue(new Error('Internal server error'));
        const functionCall = () =>
          gateway.searchResidents(Constants.DUMMY_EMAIL, {
            serviceRequestedBy: searchQuery,
            searchQuery: searchQuery,
          });
        await expect(functionCall).rejects.toEqual(
          new InternalServerError('Internal server error')
        );
      });
    });
  });
});
