const getDownloadUrl = {
  id: 'get-download-url',
  url: '/api/v1/claims/:id/download_links',
  method: 'GET',
  response: {
    status: 200,
    body:
      'https://upload.wikimedia.org/wikipedia/en/thumb/9/90/Lb_hackney_logo.svg/2880px-Lb_hackney_logo.svg.png',
  },
};

module.exports = {
  getDownloadUrl,
};
