import { AxiosInstance } from 'axios';
import { DocumentsApiGateway } from './documents-api';
import { InternalServerError } from './internal-api';

const client = {
  get: jest.fn(),
};

describe('Documents api gateway', () => {
  const gateway = new DocumentsApiGateway({
    client: (client as unknown) as AxiosInstance,
  });

  describe('GET request to /documents', () => {
    const documentId = '456';
    const expectedData = 'response to GET';
    const expectedStatus = 200;
    const expectedResponse = { data: expectedData, status: expectedStatus };

    beforeEach(() => {
      client.get.mockResolvedValue({ data: expectedResponse });
    });

    it('the request returns the correct response', async () => {
      const response = await gateway.getDocument(documentId);
      expect(response).toEqual(expectedResponse);
      expect(client.get).toHaveBeenCalledWith(
        `/api/v1/documents/${documentId}`,
        {
          headers: {
            Authorization: process.env.DOCUMENTS_API_GET_DOCUMENTS_TOKEN,
          },
        }
      );
    });

    describe('when there is an error', () => {
      it('returns internal server error', async () => {
        client.get.mockRejectedValue(new Error('Network error'));
        const functionCall = () => gateway.getDocument(documentId);
        expect(functionCall).rejects.toEqual(
          new InternalServerError('Internal server error')
        );
      });
    });
  });

  describe('GET request to /claims/{claimId}/download_links', () => {
    const claimId = '123-abc-claimId';
    const expectedData = 'www.downloadlinkfordocument.com';
    const expectedStatus = 200;
    const expectedResponse = { data: expectedData, status: expectedStatus };

    beforeEach(() => {
      client.get.mockResolvedValue({ data: expectedResponse });
    });

    it('the request returns the correct response', async () => {
      const response = await gateway.getDocumentPreSignedUrl(claimId);
      expect(response).toEqual(expectedResponse);
      expect(client.get).toHaveBeenCalledWith(
        `/api/v1/claims/${claimId}/download_links`,
        {
          headers: {
            Authorization: process.env.DOCUMENTS_API_GET_DOCUMENTS_TOKEN,
          },
        }
      );
    });
  });
});
