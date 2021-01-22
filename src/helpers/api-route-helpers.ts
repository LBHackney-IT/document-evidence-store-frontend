const GLOB = '[^/]+';
const publicRoutes = [
  { path: new RegExp(`^evidence_requests/${GLOB}$`), method: 'GET' },
  {
    path: new RegExp(`^evidence_requests/${GLOB}/document_submissions$`),
    method: 'POST',
  },
];

export const isPublicRoute = (path: string[], method: string): boolean => {
  const joinedPath = path.join('/');

  return publicRoutes.some(
    (r) => r.method == method && r.path.test(joinedPath)
  );
};
