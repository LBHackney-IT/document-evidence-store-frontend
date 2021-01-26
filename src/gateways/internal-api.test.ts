import { DocumentType } from '../domain/document-type';
import { InternalApiGateway, InternalServerError } from './internal-api';
import axios, { AxiosResponse } from 'axios';
import { ResponseMapper } from '../boundary/response-mapper';
import DocumentSubmissionFixture from '../../cypress/fixtures/document-submission-response-singular.json';
import EvidenceRequestFixture from '../../cypress/fixtures/evidence-request-response.json';
import { EvidenceRequest } from 'src/domain/evidence-request';

jest.mock('axios');
jest.mock('../boundary/response-mapper');
const mockedResponseMapper = ResponseMapper as jest.Mocked<
  typeof ResponseMapper
>;
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Internal API Gateway', () => {
  const gateway = new InternalApiGateway();

  xdescribe('getEvidenceRequests', () => {
    describe('returns the correct response', () => {
      const expectedData = EvidenceRequestFixture;
      const mappedData = EvidenceRequestFixture.map(
        ResponseMapper.mapEvidenceRequest
      );

      beforeEach(() => {
        mockedAxios.get.mockResolvedValue({
          data: expectedData,
        } as AxiosResponse);

        mockedResponseMapper.mapEvidenceRequest
          .mockReturnValueOnce(mappedData[0])
          .mockReturnValueOnce(mappedData[1]);
      });

      it('calls axios correctly', async () => {
        await gateway.getEvidenceRequests();
        expect(mockedAxios.get).toHaveBeenLastCalledWith(
          '/api/evidence/evidence_requests'
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
        mockedAxios.get.mockRejectedValue(new Error('Network error'));
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
        mockedAxios.get.mockResolvedValue({
          data: expectedData,
        });

        mockedResponseMapper.mapEvidenceRequest.mockReturnValue(mappedData);
      });

      it('calls axios correctly', async () => {
        await gateway.getEvidenceRequest(id);
        expect(mockedAxios.get).toHaveBeenLastCalledWith(
          `/api/evidence/evidence_requests/${id}`
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
        mockedAxios.get.mockRejectedValue(new Error('Network error'));
        const functionCall = () => gateway.getEvidenceRequest(id);
        expect(functionCall).rejects.toEqual(
          new InternalServerError('Internal server error')
        );
      });
    });
  });

  describe('getDocumentTypes', () => {
    describe('returns the correct response', () => {
      const expectedData = [
        {
          description: 'A valid passport open at the photo page',
          id: 'passport-scan',
          title: 'Passport',
        },
        {
          description: 'A valid UK full or provisional UK driving license',
          id: 'driving-license',
          title: 'Driving license',
        },
      ];
      const mappedData = (['blim', 'blam'] as unknown) as DocumentType[];

      beforeEach(() => {
        mockedAxios.get.mockResolvedValue({
          data: expectedData,
        } as AxiosResponse);

        mockedResponseMapper.mapDocumentType
          .mockReturnValueOnce(mappedData[0])
          .mockReturnValueOnce(mappedData[1]);
      });

      it('calls axios correctly', async () => {
        await gateway.getDocumentTypes();
        expect(mockedAxios.get).toHaveBeenLastCalledWith(
          '/api/evidence/document_types'
        );
      });

      it('maps the response', async () => {
        await gateway.getDocumentTypes();
        for (let i = 0; i < expectedData.length; i++) {
          expect(mockedResponseMapper.mapDocumentType).toHaveBeenNthCalledWith(
            i + 1,
            expectedData[i]
          );
        }
      });

      it('returns the right correct response', async () => {
        const result = await gateway.getDocumentTypes();
        expect(result).toEqual(mappedData);
      });
    });

    describe('when there is an error', () => {
      it('returns internal server error', async () => {
        mockedAxios.get.mockRejectedValue(new Error('Internal server error'));
        const functionCall = () => gateway.getDocumentTypes();
        expect(functionCall).rejects.toEqual(
          new InternalServerError('Internal server error')
        );
      });
    });
  });

  describe('createDocumentSubmission', () => {
    const documentType = 'passport-scan';
    const evidenceRequest = { id: 'evidence request id' } as EvidenceRequest;

    describe('when there is an error', () => {
      it('returns internal server error', async () => {
        mockedAxios.post.mockRejectedValue(new Error('Internal server error'));
        const functionCall = () =>
          gateway.createDocumentSubmission(evidenceRequest, documentType);
        expect(functionCall).rejects.toEqual(
          new InternalServerError('Internal server error')
        );
      });
    });

    describe('when successful', () => {
      const mappedResponse = ResponseMapper.mapDocumentSubmission(
        DocumentSubmissionFixture
      );

      beforeEach(() => {
        mockedAxios.post.mockResolvedValue({ data: DocumentSubmissionFixture });
        mockedResponseMapper.mapDocumentSubmission.mockReturnValue(
          mappedResponse
        );
      });

      it('calls axios correctly', async () => {
        await gateway.createDocumentSubmission(evidenceRequest, documentType);
        expect(mockedAxios.post).toHaveBeenCalledWith(
          `/api/evidence/evidence_requests/${evidenceRequest.id}/document_submissions`,
          {
            documentType,
          }
        );
      });

      it('maps the response correctly', async () => {
        await gateway.createDocumentSubmission(evidenceRequest, documentType);
        expect(mockedResponseMapper.mapDocumentSubmission).toHaveBeenCalledWith(
          DocumentSubmissionFixture
        );
      });

      it('returns the correct response', async () => {
        const result = await gateway.createDocumentSubmission(
          evidenceRequest,
          documentType
        );
        expect(result).toEqual(mappedResponse);
      });
    });
  });
});
