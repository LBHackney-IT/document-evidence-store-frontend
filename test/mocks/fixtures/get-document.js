const getDocument = {
  id: 'get-document',
  url: '/api/v1/documents/:id',
  method: 'GET',
  response: {
    status: 200,
    body: 'documentAsByte64',
  },
};

module.exports = {
  getDocument,
};
