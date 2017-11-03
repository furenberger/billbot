// flickrImage 
const debug = require('debug')('billbot:flickrImage');
const request = require('request');

module.exports = (flickrUrl, pick) => {
  return new Promise((resolve, reject) => {
      request({
              method: 'GET',
              url: flickrUrl
          },
          (error, response, body) => {
              if (!error && response.statusCode === 200) {
                  const jsonBody = JSON.parse(body);
                  if(jsonBody && jsonBody.photos && jsonBody.photos.photo[pick]) {
                      const flickrImage = 'https://farm' + jsonBody.photos.photo[pick].farm + '.staticflickr.com/' + jsonBody.photos.photo[pick].server + '/' + jsonBody.photos.photo[pick].id + '_' + jsonBody.photos.photo[pick].secret + '.jpg';
                      resolve(flickrImage);
                  }
                  else{
                      debug('flickr issues!');
                      reject();
                  }
              } else {
                  debug('flickr reject!');
                  reject();
              }
          }).end('{}');
  });
};