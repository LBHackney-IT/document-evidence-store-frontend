const getDocument = {
  id: 'get-document',
  url: '/api/v1/claims/:id/download',
  method: 'GET',
  response: {
    status: 200,
    body: new ArrayBuffer(20),
  },
};

module.exports = {
  getDocument,
};
