import { DocumentType } from '../domain/document-type';
import { EvidenceRequest } from '../domain/evidence-request';
import { InternalApiGateway, InternalServerError } from './internal-api';
import axios, { AxiosResponse } from 'axios';
import { ResponseMapper } from '../boundary/response-mapper';

jest.mock('axios');
jest.mock('../boundary/response-mapper');
const mockedResponseMapper = ResponseMapper as jest.Mocked<
  typeof ResponseMapper
>;
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Internal API Gateway', () => {
  const gateway = new InternalApiGateway();

  describe('getEvidenceRequests', () => {
    describe('returns the correct response', () => {
      const expectedData = ['foo', 'bar'];
      const mappedData = (['blim', 'blam'] as unknown) as EvidenceRequest[];

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
});
