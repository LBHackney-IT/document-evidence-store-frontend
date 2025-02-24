const getDownloadUrl = {
  id: 'get-download-url',
  url: '/api/v1/claims/:id/download_links',
  method: 'GET',
  variants: [
    {
      id: 'success',
      type: 'middleware',
      options: {
        middleware: (req, res) => {
          const { id } = req.params;
          if (id === 'g4ced259-53b3-446a-b4c2-98cb160b1722') {
            res.status(200);
            res.send('https://alexcorvi.github.io/heic2any/demo/1.heic');
          } else {
            res.status(200);
            res.send(
              'https://upload.wikimedia.org/wikipedia/en/thumb/9/90/Lb_hackney_logo.svg/800px-Lb_hackney_logo.svg.png'
            );
          }
        },
      },
    },
  ],
};

module.exports = [getDownloadUrl];
