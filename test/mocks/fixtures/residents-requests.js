const searchResidents = require('../../../cypress/fixtures/residents/search.json');
const residentFixture = require('../../../cypress/fixtures/residents/getResident.json');

const getResidents = {
  id: 'get-residents',
  url: '/api/v1/residents/:searchQuery',
  method: 'GET',
  response: {
    status: 200,
    body: searchResidents,
  },
};

const getResident = {
  id: 'get-resident',
  url: '/api/v1/residents/:id',
  method: 'GET',
  response: {
    status: 200,
    body: residentFixture,
  },
};

const createResident = {
  id: 'create-resident',
  url: '/api/v1/residents',
  method: 'POST',
  response: {
    status: 201,
    body: residentFixture,
  },
};

module.exports = {
  getResidents,
  getResident,
  createResident,
};
