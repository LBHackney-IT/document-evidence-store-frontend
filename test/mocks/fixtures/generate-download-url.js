const generateDownloadUrl = {
  id: 'generate-download-url',
  url: '/api/v1/claims/:id/download_links',
  method: 'POST',
  response: {
    status: 201,
    body: 'https://en.wikipedia.org/static/images/project-logos/enwiki.png',
  },
};

module.exports = {
  generateDownloadUrl,
};
