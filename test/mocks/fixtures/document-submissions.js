const documentSubmissionPng = require('../../../cypress/fixtures/document_submissions/get-png.json');
const documentSubmissionPdf = require('../../../cypress/fixtures/document_submissions/get-pdf.json');
const documentSubmissionsWithResident = require('../../../cypress/fixtures/document_submissions/get-many.json');

// There may be a neater way of doing this with MocksServer variants but I couldn't get it to work.
// Instead I have created two behaviours.
const getDocumentSubmissionPng = {
  id: 'get-document-submission-png',
  url: '/api/v1/document_submissions/3fa85f64-5717-4562-b3fc-2c963f66afa6',
  method: 'GET',
  response: {
    status: 200,
    body: documentSubmissionPng,
  },
};

const getDocumentSubmissionPdf = {
  id: 'get-document-submission-pdf',
  url: '/api/v1/document_submissions/2a220753-9a7c-428d-98cd-73999d733bfb',
  method: 'GET',
  response: {
    status: 200,
    body: documentSubmissionPdf,
  },
};

const getDocumentSubmissionWithResident = {
  id: 'get-document-submissions-with-resident',
  url:
    '/api/v1/document_submissions?serviceRequestedBy=Development+Housing+Team&residentId=:residentId',
  method: 'GET',
  response: {
    status: 200,
    body: documentSubmissionsWithResident,
  },
};

const updateDocumentSubmission = {
  id: 'update-document-submission',
  url: '/api/v1/document_submissions/:id',
  method: 'PATCH',
  response(req, res) {
    res.status(200);
    const body = { ...getDocumentSubmissionPng, state: req.body.state };
    res.send(body);
  },
};

module.exports = {
  updateDocumentSubmission,
  getDocumentSubmissionPng,
  getDocumentSubmissionPdf,
  getDocumentSubmissionWithResident,
};
