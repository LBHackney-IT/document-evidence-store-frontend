import { DocumentType } from '../domain/document-type';
import { EvidenceRequest } from '../domain/evidence-request';
import { InternalApiGateway } from './internal-api';

describe('Internal API Gateway', () => {
  const gateway = new InternalApiGateway();

  describe('getDocumentTypes', () => {
    it('returns DocumentTypes', () => {
      const result = gateway.getDocumentTypes();
      expect(
        result.every((r) => r instanceof DocumentType === true)
      ).toBeTruthy();
    });
  });

  describe('getEvidenceRequests', () => {
    it('returns DocumentTypes', () => {
      const result = gateway.getEvidenceRequests();
      expect(
        result.every((r) => r instanceof EvidenceRequest === true)
      ).toBeTruthy();
    });
  });
});
