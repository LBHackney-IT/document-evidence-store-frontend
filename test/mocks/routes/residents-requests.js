const searchResidents = require('../../../cypress/fixtures/residents/search.json');
const residentFixture = require('../../../cypress/fixtures/residents/getResident.json');
const mergeAndLink = require('../../../cypress/fixtures/residents/merge-and-link.json');

const getResidents = {
  id: 'get-residents',
  url: '/api/v1/residents/search',
  method: 'GET',
  variants: [
    {
      id: 'success',
      type: 'json',
      options: {
        status: 200,
        body: searchResidents,
      },
    },
  ],
};

const getResident = {
  id: 'get-resident',
  url: '/api/v1/residents/:id',
  method: 'GET',
  variants: [
    {
      id: 'success',
      type: 'json',
      options: {
        status: 200,
        body: residentFixture,
      },
    },
  ],
};

const createResident = {
  id: 'create-resident',
  url: '/api/v1/residents',
  method: 'POST',
  variants: [
    {
      id: 'success',
      type: 'json',
      options: {
        status: 201,
        body: residentFixture,
      },
    },
  ],
};

const linkAndMergeResident = {
  id: 'link-and-merge-resident',
  url: 'api/v1/residents/merge-and-link',
  method: 'POST',
  variants: [
    {
      id: 'success',
      type: 'json',
      options: {
        status: 200,
        body: mergeAndLink,
      },
    },
  ],
};

module.exports = [
  getResident,
  getResidents,
  createResident,
  linkAndMergeResident,
];
