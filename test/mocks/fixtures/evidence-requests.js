const evidenceRequestsIndex = require('../../../cypress/fixtures/evidence_requests/index.json');
const evidenceRequestsId = require('../../../cypress/fixtures/evidence_requests/id.json');
const evidenceRequestsToReview = require('../../../cypress/fixtures/evidence_requests/get-to-review.json');
const documentSubmission = require('../../../cypress/fixtures/document_submissions/create.json');
const documentTypes = require('../../../cypress/fixtures/document_types/index.json');
const { v4: uuidv4 } = require('uuid');

const getEvidenceRequest = {
  id: 'get-evidence-request',
  url: '/api/v1/evidence_requests/:id',
  method: 'GET',
  response: {
    status: 200,
    body: evidenceRequestsId,
  },
};

const getEvidenceRequests = {
  id: 'get-evidence-requests',
  url: '/api/v1/evidence_requests',
  method: 'GET',
  response: {
    status: 200,
    body: evidenceRequestsIndex,
  },
};

const getEvidenceRequestsToReview = {
  id: 'get-evidence-requests-to-review',
  url: '/api/v1/evidence_requests?team=Development+Housing+Team&state=1',
  method: 'GET',
  response: {
    status: 200,
    body: evidenceRequestsToReview,
  },
};

const createEvidenceRequest = {
  id: 'create-evidence-request',
  url: '/api/v1/evidence_requests',
  method: 'POST',
  response: {
    status: 201,
    body: evidenceRequestsId,
  },
};

const createDocumentSubmission = {
  id: 'create-document-submission',
  url: '/api/v1/evidence_requests/:id/document_submissions',
  method: 'POST',
  response(req, res) {
    res.status(201);
    const documentType = documentTypes.find(
      (dt) => dt.id === req.body.documentType
    );
    const body = {
      ...documentSubmission,
      id: uuidv4(),
      documentType,
    };
    res.send(body);
  },
};

module.exports = {
  getEvidenceRequest,
  getEvidenceRequests,
  getEvidenceRequestsToReview,
  createEvidenceRequest,
  createDocumentSubmission,
};
