import { DateTime } from 'luxon';
import { EvidenceRequest } from 'src/domain/evidence-request';
import { Resident } from 'src/domain/resident';
import { DocumentType } from 'src/domain/document-type';
import superjson from 'superjson';
import { DocumentSubmission } from 'src/domain/document-submission';
import { Document } from 'src/domain/document';

export const registerDomainModels = (): void => {
  try {
    superjson.registerClass(Resident, { identifier: 'Resident' });
    superjson.registerClass(EvidenceRequest, { identifier: 'EvidenceRequest' });
    superjson.registerClass(DocumentType, { identifier: 'DocumentType' });
    superjson.registerClass(DocumentSubmission, {
      identifier: 'DocumentSubmission',
    });
    superjson.registerClass(Document, { identifier: 'Document' });

    superjson.registerCustom<DateTime, string>(
      {
        isApplicable: (v): v is DateTime => v instanceof DateTime,
        serialize: (v) => v.toISO(),
        deserialize: (v) => DateTime.fromISO(v),
      },
      'datetime'
    );
  } catch (e) {
    // console.error(e);
  }
};
