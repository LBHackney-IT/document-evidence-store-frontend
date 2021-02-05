import { DateTime } from 'luxon';
import EvidenceRequestFixture from '../../cypress/fixtures/evidence_requests/index.json';
import DocumentTypeFixture from '../../cypress/fixtures/document_types/index.json';
import DocumentSubmissionCreate from '../../cypress/fixtures/document_submissions/create.json';
import DocumentSubmissionGet from '../../cypress/fixtures/document_submissions/get.json';
import { DeliveryMethod, EvidenceRequest } from '../domain/evidence-request';
import { Resident } from '../domain/resident';
import { ResponseMapper } from './response-mapper';
import { DocumentType } from '../domain/document-type';
import { Document } from '../domain/document';
import {
  DocumentState,
  DocumentSubmission,
} from '../domain/document-submission';
import { DocumentSubmissionResponse } from 'types/api';

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
      expect(result.documentTypes).toEqual([
        new DocumentType({
          id: 'passport-scan',
          title: 'Passport',
          description: 'A valid passport open at the photo page',
        }),
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
    let responseJson: DocumentSubmissionResponse = DocumentSubmissionCreate;

    beforeEach(() => {
      result = ResponseMapper.mapDocumentSubmission(responseJson);
    });

    it('maps the basic attributes', () => {
      const { claimId, rejectionReason, id, uploadPolicy } = responseJson;

      expect(result).toMatchObject({
        claimId,
        rejectionReason,
        id,
        uploadPolicy,
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

    it('maps the document type', () => {
      expect(result.documentType).toEqual(
        new DocumentType({
          id: 'passport-scan',
          title: 'Passport',
          description: 'A valid passport open at the photo page',
        })
      );
    });

    describe('when document is present', () => {
      beforeAll(() => {
        responseJson = DocumentSubmissionGet;
      });

      it('maps the document', () => {
        expect(result.document).toBeInstanceOf(Document);
      });
    });
  });
});
