const generateDownloadUrl = {
    id: 'generate-download-url',
    url: '/api/v1/claims/:id/download_links',
    method: 'POST',
    response: {
      status: 201,
      body: 'http://www.google.com',
    },
};

module.exports = {
    generateDownloadUrl
  };