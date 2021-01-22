import { isPublicRoute } from './api-route-helpers';

describe('api route helpers', () => {
  describe('isPublicRoute', () => {
    const ids = ['foo', '4b2955e3-5925-4c6b-80be-93da32c60c77'];

    it('is true for a public route', () => {
      for (const id of ids) {
        expect(isPublicRoute(['evidence_requests', id], 'GET')).toBeTruthy();
        expect(
          isPublicRoute(
            ['evidence_requests', id, 'document_submissions'],
            'POST'
          )
        ).toBeTruthy();
      }
    });

    it('is false for a public route but method is incorrect', () => {
      for (const id of ids) {
        expect(isPublicRoute(['evidence_requests', id], 'POST')).toBeFalsy();
        expect(
          isPublicRoute(
            ['evidence_requests', id, 'document_submissions'],
            'PATCH'
          )
        ).toBeFalsy();
      }
    });

    it('is false for private route', () => {
      expect(isPublicRoute(['evidence_requests'], 'POST')).toBeFalsy();
    });
  });
});
