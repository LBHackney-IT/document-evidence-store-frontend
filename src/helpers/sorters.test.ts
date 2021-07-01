import { sortEvidenceRequestsDescending } from './sorters';
import { EvidenceRequest } from '../domain/evidence-request';
import EvidenceRequestFixture from '../../cypress/fixtures/evidence_requests/index.json';

describe('sortEvidenceRequestsDescending', () => {
  it('sorts the evidence requests in descending order', () => {
    const evidenceRequests = (EvidenceRequestFixture as unknown) as EvidenceRequest[];
    const result = sortEvidenceRequestsDescending(evidenceRequests);
    expect(result[0].id).toBe('3fa85f64-5717-4562-b3fc-2c963f66afa8');
    expect(result[1].id).toBe('3fa85f64-5717-4562-b3fc-2c963f66afa7');
    expect(result[2].id).toBe('3fa85f64-5717-4562-b3fc-2c963f66afa6');
  });
});
