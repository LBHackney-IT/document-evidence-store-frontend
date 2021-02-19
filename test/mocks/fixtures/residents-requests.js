const searchResidents = require('../../../cypress/fixtures/residents/search.json');

const getResidents = {
  id: 'get-residents',
  url: '/api/v1/residents/:searchQuery',
  method: 'GET',
  response: {
    status: 200,
    body: searchResidents,
  },
};

module.exports = {
  getResidents,
};
