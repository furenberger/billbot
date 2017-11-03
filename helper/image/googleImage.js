// googleImage 
const debug = require('debug')('billbot:googleImage');
const request = require('request');

module.exports = (googleUrl, pick) => {
  return new Promise((resolve, reject) => {
    // debug('googleUrl: ', googleUrl);

    const options = {
        method   : 'GET',
        url      : googleUrl,
        headers : {
            Referer  : process.env.referer
        }
    };
    
    request(options,(error, response, body) => {
            debug('error: ', error);
            debug('body: ', body);

            if (!error && response.statusCode === 200) {
                const jsonBody = JSON.parse(body);
                if(jsonBody && jsonBody.items && jsonBody.items[pick] && jsonBody.items[pick].link) {
                    resolve(jsonBody.items[pick].link);
                }else{
                    debug('reject google')
                    reject();
                }
            } else {
                // google has the errorz
                // const jsonErrorBody = JSON.parse(body);
                // console.log("Google error: ", jsonErrorBody.error.message);
                reject();
            }
        });
  });
};