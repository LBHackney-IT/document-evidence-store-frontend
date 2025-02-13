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

// We need to add a specific claim id to load the HEIC file
const getDownloadUrlHeic = {
  id: 'get-download-url-heic',
  url: '/api/v1/claims/g4ced259-53b3-446a-b4c2-98cb160b1722/download_links',
  method: 'GET',
  response: {
    status: 200,
    body: 'https://alexcorvi.github.io/heic2any/demo/1.heic',
  },
};

module.exports = {
  getDownloadUrl,
  getDownloadUrlHeic,
};
