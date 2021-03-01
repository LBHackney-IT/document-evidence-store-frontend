const documentSubmission = require('../../../cypress/fixtures/document_submissions/get.json');
const documentSubmissionsWithResident = require('../../../cypress/fixtures/document_submissions/get-many.json')

const getDocumentSubmission = {
  id: 'get-document-submission',
  url: '/api/v1/document_submissions/:id',
  method: 'GET',
  response: {
    status: 200,
    body: documentSubmission,
  },
};

const getDocumentSubmissionWithResident = {
  id: 'get-document-submissions-with-resident',
  url: '/api/v1/document_submissions?serviceRequestedBy=Housing+benefit&residentId=:residentId',
  method: 'GET',
  response: {
    status: 200,
    body: documentSubmissionsWithResident,
  },
}

const updateDocumentSubmission = {
  id: 'update-document-submission',
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
  getDocumentSubmission,
  getDocumentSubmissionWithResident
};
