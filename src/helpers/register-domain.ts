import { DateTime } from 'luxon';
import { EvidenceRequest } from 'src/domain/evidence-request';
import { Resident } from 'src/domain/resident';
import { DocumentType } from 'src/domain/document-type';
import superjson from 'superjson';
import { DocumentSubmission } from 'src/domain/document-submission';

let registered = false;

if (!registered) {
  registered = true;

  try {
    superjson.registerClass(Resident);
    superjson.registerClass(EvidenceRequest);
    superjson.registerClass(DocumentType);
    superjson.registerClass(DocumentSubmission);

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
}
