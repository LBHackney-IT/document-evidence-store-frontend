const documentSubmissionPng = require('../../../cypress/fixtures/document_submissions/get-png.json');
const documentSubmissionPdf = require('../../../cypress/fixtures/document_submissions/get-pdf.json');
const documentSubmissionHeic = require('../../../cypress/fixtures/document_submissions/get-heic.json');
const approvedDocumentSubmission = require('../../../cypress/fixtures/document_submissions/get-approved.json');
const rejectedDocumentSubmission = require('../../../cypress/fixtures/document_submissions/get-rejected.json');
const documentSubmissionsWithResident = require('../../../cypress/fixtures/document_submissions/get-many-response-object.json');
const approvedDocumentSubmissionWithResident = require('../../../cypress/fixtures/document_submissions/get-approved-response-object.json');
const rejecteddDocumentSubmissionWithResident = require('../../../cypress/fixtures/document_submissions/get-rejected-response-object.json');
const pendingdDocumentSubmissionWithResident = require('../../../cypress/fixtures/document_submissions/get-pending-response-object.json');
const documentSubmissionExpiredClaim = require('../../../cypress/fixtures/document_submissions/get-expired.json');

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

const getApprovedDocumentSubmissionPng = {
  id: 'get-approved-document-submission-png',
  url: '/api/v1/document_submissions/c82120d2-0a5c-4f40-bdcd-5a18d8773446',
  method: 'GET',
  response: {
    status: 200,
    body: approvedDocumentSubmission,
  },
};

const getRejectedDocumentSubmissionPng = {
  id: 'get-rejected-document-submission-png',
  url: '/api/v1/document_submissions/c82120d2-0a5c-4f40-bdcd-5a18d8773447',
  method: 'GET',
  response: {
    status: 200,
    body: rejectedDocumentSubmission,
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

const getDocumentSubmissionHeic = {
  id: 'get-document-submission-heic',
  url: '/api/v1/document_submissions/f4ced259-53b3-446a-b4c2-98cb160b1722',
  method: 'GET',
  response: {
    status: 200,
    body: documentSubmissionHeic,
  },
};

const getDocumentSubmissionWithResident = {
  id: 'get-document-submissions-with-resident',
  url:
    '/api/v1/document_submissions?residentId=:residentId&team=Development+Housing+Team&page=1&pageSize=10',
  method: 'GET',
  response: {
    status: 200,
    body: documentSubmissionsWithResident,
  },
};

const getApprovedDocumentSubmissionWithResident = {
  id: 'get-approved-document-submissions-with-resident',
  url:
    '/api/v1/document_submissions?residentId=:residentId&team=Development+Housing+Team&state=Approved&page=1&pageSize=10',
  method: 'GET',
  response: {
    status: 200,
    body: approvedDocumentSubmissionWithResident,
  },
};

const geRejectedDocumentSubmissionWithResident = {
  id: 'get-rejected-document-submissions-with-resident',
  url:
    '/api/v1/document_submissions?residentId=:residentId&team=Development+Housing+Team&state=Rejected&page=1&pageSize=10',
  method: 'GET',
  response: {
    status: 200,
    body: rejecteddDocumentSubmissionWithResident,
  },
};

const getPendingDocumentSubmissionWithResident = {
  id: 'get-pending-document-submissions-with-resident',
  url:
    '/api/v1/document_submissions?residentId=:residentId&team=Development+Housing+Team&state=Uploaded&page=1&pageSize=10',
  method: 'GET',
  response: {
    status: 200,
    body: pendingdDocumentSubmissionWithResident,
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

const getDocumentSubmissionExpiredClaim = {
  id: 'get-document-submissions-with-expired-claim',
  url: '/api/v1/document_submissions/c82120d2-0a5c-4f40-bdcd-5a18d877344v',
  method: 'GET',
  response: {
    status: 200,
    body: documentSubmissionExpiredClaim,
  },
};

module.exports = {
  updateDocumentSubmission,
  getDocumentSubmissionPng,
  getDocumentSubmissionPdf,
  getDocumentSubmissionHeic,
  getDocumentSubmissionWithResident,
  getApprovedDocumentSubmissionWithResident,
  geRejectedDocumentSubmissionWithResident,
  getPendingDocumentSubmissionWithResident,
  getApprovedDocumentSubmissionPng,
  getRejectedDocumentSubmissionPng,
  getDocumentSubmissionExpiredClaim,
};
