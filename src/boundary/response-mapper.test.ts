import { DateTime } from 'luxon';
import EvidenceRequestFixture from '../../cypress/fixtures/evidence-request-response.json';
import DocumentTypeFixture from '../../cypress/fixtures/document-types-response.json';
import DocumentSubmissionFixture from '../../cypress/fixtures/document-submission-response-singular.json';
import { DeliveryMethod, EvidenceRequest } from '../domain/evidence-request';
import { Resident } from '../domain/resident';
import { ResponseMapper } from './response-mapper';
import { DocumentType } from '../domain/document-type';
import {
  DocumentState,
  DocumentSubmission,
} from '../domain/document-submission';

describe('ResponseMapper', () => {
  describe('.mapEvidenceRequest', () => {
    let result: EvidenceRequest;
    const [responseJson] = EvidenceRequestFixture;

    beforeEach(() => {
      result = ResponseMapper.mapEvidenceRequest(responseJson);
    });

    it('maps basic attributes', () => {
      const { id, serviceRequestedBy } = responseJson;
      expect(result).toMatchObject({ id, serviceRequestedBy });
      expect(result).toBeInstanceOf(EvidenceRequest);
    });

    it('maps the delivery methods', () => {
      expect(result.deliveryMethods).toEqual([
        DeliveryMethod.SMS,
        DeliveryMethod.EMAIL,
      ]);
    });

    it('maps the document type', () => {
      expect(result.documentTypes).toMatchObject([
        {
          id: 'passport-scan',
          title: 'Passport',
          description: 'A valid passport open at the photo page',
        },
      ]);
    });

    // 2020-11-30T15:34:12.299Z
    it('maps the date', () => {
      expect(result.createdAt).toBeInstanceOf(DateTime);
      expect(result.createdAt).toMatchObject({
        year: 2020,
        month: 11,
        day: 30,
      });
    });

    it('maps the resident', () => {
      expect(result.resident).toBeInstanceOf(Resident);
      expect(result.resident).toMatchObject(responseJson.resident);
    });
  });

  describe('.mapDocumentType', () => {
    it('maps basic attributes', () => {
      const [responseJson] = DocumentTypeFixture;
      const result = ResponseMapper.mapDocumentType(responseJson);

      expect(result).toBeInstanceOf(DocumentType);
      expect(result).toMatchObject(responseJson);
    });
  });

  describe('.mapDocumentSubmission', () => {
    let result: DocumentSubmission;
    const responseJson = DocumentSubmissionFixture;

    beforeEach(() => {
      result = ResponseMapper.mapDocumentSubmission(responseJson);
    });

    it('maps the basic attributes', () => {
      const {
        claimId,
        rejectionReason,
        id,
        uploadPolicy,
        documentType,
      } = responseJson;

      expect(result).toMatchObject({
        claimId,
        rejectionReason,
        id,
        uploadPolicy,
        documentType,
      });
    });

    // 2021-01-14T10:23:42.958Z
    it('maps the date', () => {
      expect(result.createdAt).toBeInstanceOf(DateTime);
      expect(result.createdAt).toMatchObject({
        year: 2021,
        month: 1,
        day: 14,
      });
    });

    it('maps the document state', () => {
      expect(result.state).toEqual(DocumentState.PENDING);
    });
  });
});
