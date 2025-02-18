const evidenceRequestsIndex = require('../../../cypress/fixtures/evidence_requests/index.json');
const evidenceRequestsId = require('../../../cypress/fixtures/evidence_requests/id.json');
const documentSubmission = require('../../../cypress/fixtures/document_submissions/create.json');
const documentTypes = require('../../../cypress/fixtures/document_types/index.json');
const { v4: uuidv4 } = require('uuid');

const getEvidenceRequest = {
  id: 'get-evidence-request',
  url: '/api/v1/evidence_requests/:id',
  method: 'GET',
  variants: [
    {
      id: 'success',
      type: 'json',
      options: {
        status: 200,
        body: evidenceRequestsId,
      },
    },
  ],
};

const getEvidenceRequests = {
  id: 'get-evidence-requests',
  url: '/api/v1/evidence_requests',
  method: 'GET',
  variants: [
    {
      id: 'success',
      type: 'json',
      options: {
        status: 200,
        body: evidenceRequestsIndex,
      },
    },
  ],
};

const createEvidenceRequest = {
  id: 'create-evidence-request',
  url: '/api/v1/evidence_requests',
  method: 'POST',
  variants: [
    {
      id: 'success',
      type: 'json',
      options: {
        status: 201,
        body: evidenceRequestsId,
      },
    },
  ],
};

const createDocumentSubmission = {
  id: 'create-document-submission',
  url: '/api/v1/evidence_requests/:id/document_submissions',
  method: 'POST',
  variants: [
    {
      id: 'success',
      type: 'middleware',
      options: {
        middleware: (req, res) => {
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
      },
    },
  ],
};

module.exports = [
  getEvidenceRequest,
  getEvidenceRequests,
  createEvidenceRequest,
  createDocumentSubmission,
];
