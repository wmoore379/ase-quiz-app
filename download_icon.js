const https = require('https');
const fs = require('fs');

function download(url, dest) {
  const file = fs.createWriteStream(dest);
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, function(response) {
    if (response.statusCode === 200) {
      response.pipe(file);
      file.on('finish', function() {
        file.close();  // close() is async, call cb after close completes.
        console.log('Downloaded ' + dest);
      });
    } else {
      console.log('Failed', response.statusCode);
    }
  }).on('error', function(err) {
    fs.unlink(dest, () => {});
    console.log(err.message);
  });
}

download('https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Eo_circle_blue_white_wrench.svg/192px-Eo_circle_blue_white_wrench.svg.png', 'icon-192.png');
download('https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Eo_circle_blue_white_wrench.svg/512px-Eo_circle_blue_white_wrench.svg.png', 'icon-512.png');
