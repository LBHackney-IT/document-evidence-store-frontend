const getDocument = {
  id: 'get-document',
  url: '/api/v1/documents/:id',
  method: 'GET',
  response: {
    status: 200,
    body: 'documentAsByte64',
  },
};

const base64document = {
  id: 'get-base64-document',
  url: '/api/v1/document_submissions/documentAsByte64',
  method: 'GET',
  response: {
    status: 200,
    body: 'documentAsByte64',
  },
};

module.exports = {
  getDocument,
  base64document,
};
