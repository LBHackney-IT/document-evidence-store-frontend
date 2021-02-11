import { AxiosInstance } from 'axios';
import { DocumentSubmissionResponse } from 'types/api';
import { ResponseMapper } from '../boundary/response-mapper';
import {
  DocumentState,
  DocumentSubmission,
} from '../domain/document-submission';
import { InternalApiGateway, InternalServerError } from './internal-api';

jest.mock('../boundary/response-mapper');
const mockedResponseMapper = ResponseMapper as jest.Mocked<
  typeof ResponseMapper
>;

const client = {
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
        await gateway.updateDocumentSubmission(documentSubmissionId, {
          state: DocumentState.UPLOADED,
        });

        expect(
          client.patch
        ).toHaveBeenCalledWith(
          `/api/evidence/document_submissions/${documentSubmissionId}`,
          { state: 'UPLOADED' }
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
