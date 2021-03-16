import { AxiosInstance } from 'axios';
import { DocumentsApiGateway } from './documents-api';
import { InternalServerError } from './internal-api';

const client = {
  post: jest.fn(),
};

describe('Documents api gateway', () => {
  const gateway = new DocumentsApiGateway({
    client: (client as unknown) as AxiosInstance,
  });

  describe('POST request to /claims/download_links', () => {
    const claimId = '123';
    const documentId = '456';
    const expectedData = 'response to POST';
    const expectedStatus = 200;
    const expectedResponse = { data: expectedData, status: expectedStatus };

    beforeEach(() => {
      client.post.mockResolvedValue({ data: expectedResponse });
    });

    it('the request returns the correct response', async () => {
      const response = await gateway.generateDownloadUrl(claimId, documentId);
      expect(response).toEqual(expectedResponse);
      expect(client.post).toHaveBeenCalledWith(
        `/api/v1/claims/${claimId}/download_links`,
        { documentId },
        {
          headers: {
            Authorization: process.env.DOCUMENTS_API_POST_CLAIMS_TOKEN,
          },
        }
      );
    });

    describe('when there is an error', () => {
      it('returns internal server error', async () => {
        client.post.mockRejectedValue(new Error('Network error'));
        const functionCall = () =>
          gateway.generateDownloadUrl(claimId, documentId);
        expect(functionCall).rejects.toEqual(
          new InternalServerError('Internal server error')
        );
      });
    });
  });
});
