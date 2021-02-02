const documentSubmission = require('../../../cypress/fixtures/document_submissions/id.json');

const updateDocumentSubmission = {
  id: 'update-document-submission-uploaded',
  url: '/api/v1/document_submissions/:id',
  method: 'PATCH',
  response(req, res) {
    res.status(200);
    const body = { ...documentSubmission, state: req.body.state };
    res.send(body);
  },
};

module.exports = {
  updateDocumentSubmission,
};
