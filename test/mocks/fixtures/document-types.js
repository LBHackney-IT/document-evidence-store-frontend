const documentTypes = require('../../../cypress/fixtures/document_types/index.json');

const getDocumentTypes = {
  id: 'get-document-types',
  url: '/api/v1/document_types',
  method: 'GET',
  response: {
    status: 200,
    body: documentTypes,
  },
};
module.exports = {
  getDocumentTypes,
};
