import { AxiosInstance } from 'axios';
import {
  DocumentSubmissionResponse,
  ResidentResponse,
  EvidenceRequestResponse,
} from 'types/api';
import { DocumentSubmissionRequest, DocumentSubmissionWithoutEvidenceRequestRequest } from '../gateways/internal-api';
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
import { EvidenceRequestState } from 'src/domain/enums/EvidenceRequestState';
import EvidenceRequestResponseFixture from '../../cypress/fixtures/evidence_requests/index.json';
import { EvidenceRequestsFixture } from './fixtures/evidence-request';

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
            userUpdatedBy: 'test@hackney.gov.uk',
          }
        );

        expect(client.patch).toHaveBeenCalledWith(
          `/api/evidence/document_submissions/${documentSubmissionId}`,
          { state: 'UPLOADED', userUpdatedBy: 'test@hackney.gov.uk' },
          { headers: { UserEmail: Constants.DUMMY_EMAIL } }
        );
      });

      it('returns the updated model', async () => {
        const result = await gateway.updateDocumentSubmission(
          Constants.DUMMY_EMAIL,
          documentSubmissionId,
          {
            state: DocumentState.UPLOADED,
            userUpdatedBy: 'test@hackney.gov.uk',
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
              userUpdatedBy: 'test@hackney.gov.uk',
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
    const request = {} as DocumentSubmissionRequest;
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
          request
        );

        expect(
          client.post
        ).toHaveBeenCalledWith(
          `/api/evidence/evidence_requests/${evidenceRequestId}/document_submissions`,
          request,
          { headers: { UserEmail: Constants.DUMMY_EMAIL } }
        );
      });

      it('returns the updated model', async () => {
        const result = await gateway.createDocumentSubmission(
          Constants.DUMMY_EMAIL,
          evidenceRequestId,
          request
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
            request
          );
        await expect(functionCall).rejects.toEqual(
          new InternalServerError('Internal server error')
        );
      });
    });
  });

  describe('createDocumentSubmissionWithoutEvidenceRequest', () => {
    const request = {} as DocumentSubmissionWithoutEvidenceRequestRequest;
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
        await gateway.createDocumentSubmissionWithoutEvidenceRequest(
          Constants.DUMMY_EMAIL,          
          request
        );

        expect(
          client.post
        ).toHaveBeenCalledWith(
          `/api/evidence/document_submissions`,
          request,
          { headers: { UserEmail: Constants.DUMMY_EMAIL } }
        );
      });

      it('returns the updated model', async () => {
        const result = await gateway.createDocumentSubmissionWithoutEvidenceRequest(
          Constants.DUMMY_EMAIL,          
          request
        );

        expect(result).toBe(expectedResult);
      });
    });

    describe('when there is an error', () => {
      it('returns internal server error', async () => {
        client.post.mockRejectedValue(new Error('Internal server error'));
        const functionCall = () =>
          gateway.createDocumentSubmissionWithoutEvidenceRequest(
            Constants.DUMMY_EMAIL,            
            request
          );
        await expect(functionCall).rejects.toEqual(
          new InternalServerError('Internal server error')
        );
      });
    });
  })

  describe('createEvidenceRequest', () => {
    const baseRequest: EvidenceRequestRequest = {
      documentTypes: ['passport'],
      deliveryMethods: [],
      resident: {
        name: 'Frodo',
        email: 'frodo@bagend.com',
        phoneNumber: '0123',
      },
      team: 'Example Service',
      reason: 'example-reason',
      noteToResident: 'not all those who wander are lost',
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
          team: searchQuery,
          searchQuery: searchQuery,
        });

        expect(client.get).toHaveBeenCalledWith(
          `/api/evidence/residents/search`,
          {
            params: {
              team: searchQuery,
              searchQuery: searchQuery,
            },
            headers: { UserEmail: Constants.DUMMY_EMAIL },
          }
        );
      });

      it('returns the updated model', async () => {
        const result = await gateway.searchResidents(Constants.DUMMY_EMAIL, {
          team: searchQuery,
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
            team: searchQuery,
            searchQuery: searchQuery,
          });
        await expect(functionCall).rejects.toEqual(
          new InternalServerError('Internal server error')
        );
      });
    });
  });

  describe('filterToReviewEvidenceRequests', () => {
    const apiResponse: EvidenceRequestResponse[] = EvidenceRequestResponseFixture;
    const expected: EvidenceRequest[] = EvidenceRequestsFixture;
    const team = 'Development Team';

    describe('when successful', () => {
      beforeEach(() => {
        client.get.mockClear();
        client.get.mockResolvedValue({
          data: apiResponse,
        });

        expected.forEach(
          mockedResponseMapper.mapEvidenceRequest.mockReturnValueOnce
        );
      });

      it('makes the api request', async () => {
        await gateway.filterToReviewEvidenceRequests(
          Constants.DUMMY_EMAIL,
          team,
          EvidenceRequestState.FOR_REVIEW
        );

        expect(client.get).toHaveBeenCalledWith(
          `/api/evidence/evidence_requests`,
          {
            params: {
              team: team,
              state: EvidenceRequestState.FOR_REVIEW,
            },
            headers: {
              UserEmail: Constants.DUMMY_EMAIL,
            },
          }
        );
      });

      it('returns the updated model', async () => {
        const result = await gateway.filterToReviewEvidenceRequests(
          Constants.DUMMY_EMAIL,
          team,
          EvidenceRequestState.FOR_REVIEW
        );

        expect(result).toEqual(expected);
      });
    });

    describe('when there is an error', () => {
      it('returns internal server error', async () => {
        client.get.mockClear();
        client.get.mockRejectedValue(new Error('Internal server error'));
        const functionCall = () => {
          return gateway.filterToReviewEvidenceRequests(
            Constants.DUMMY_EMAIL,
            team,
            EvidenceRequestState.FOR_REVIEW
          );
        };
        await expect(functionCall).rejects.toEqual(
          new InternalServerError('Internal server error')
        );
      });
    });
  });

  describe('sendUploadConfirmationNotificationToResidentAndStaff', () => {
    const evidenceRequestId = 'evidence request id';

    describe('when successful', () => {
      beforeEach(() => {
        client.post.mockResolvedValue({
          data: {},
        });
      });

      it('makes the api request', async () => {
        await gateway.sendUploadConfirmationNotificationToResidentAndStaff(
          Constants.DUMMY_EMAIL,
          evidenceRequestId
        );

        expect(
          client.post
        ).toHaveBeenCalledWith(
          `/api/evidence/evidence_requests/${evidenceRequestId}/confirmation`,
          null,
          { headers: { UserEmail: Constants.DUMMY_EMAIL } }
        );
      });
    });

    describe('when there is an error', () => {
      it('returns internal server error', async () => {
        client.post.mockRejectedValue(new Error('Internal server error'));
        const functionCall = () =>
          gateway.sendUploadConfirmationNotificationToResidentAndStaff(
            Constants.DUMMY_EMAIL,
            evidenceRequestId
          );
        await expect(functionCall).rejects.toEqual(
          new InternalServerError('Internal server error')
        );
      });
    });
  });
});
