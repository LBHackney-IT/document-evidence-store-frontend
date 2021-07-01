import { EvidenceRequest } from '../domain/evidence-request';

export const sortEvidenceRequestsDescending = (
  evidenceRequests: EvidenceRequest[]
): EvidenceRequest[] => {
  return evidenceRequests.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
};
