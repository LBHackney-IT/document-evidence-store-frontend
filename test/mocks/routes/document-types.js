const documentTypes = require('../../../cypress/fixtures/document_types/index.json');
const staffSelectedDocumentTypes = require('../../../cypress/fixtures/document_types/staffSelected.json');

const getDocumentTypes = {
  id: 'get-document-types',
  url: '/api/v1/document_types/:team',
  method: 'GET',
  variants: [
    {
      id: 'success',
      type: 'json',
      options: {
        status: 200,
        body: documentTypes,
      },
    },
  ],
};

const getStaffSelectedDocumentTypes = {
  id: 'get-staff-selected-document-types',
  url: '/api/v1/document_types/staff_selected/:team',
  method: 'GET',
  variants: [
    {
      id: 'success',
      type: 'json',
      options: {
        status: 200,
        body: staffSelectedDocumentTypes,
      },
    },
  ],
};

module.exports = [getDocumentTypes, getStaffSelectedDocumentTypes];
