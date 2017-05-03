'use strict';
const debug = require('debug')('billbot:image');

const request = require('request');
const Socks = require('socks');

/*
    generalize the request call to the google search api (well it still depends on bot)
 */
module.exports = (searchString) => {
    const fixieUrl = process.env.FIXIE_SOCKS_HOST;
    const fixieValues = fixieUrl.split(new RegExp('[/(:\\/@)/]+'));

    //from 25 pages pick random number
    const start = Math.floor(Math.random() * 25);
    const pick = Math.floor(Math.random() * 10);

    const flickrUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + process.env.FLICKR_KEY + '&text=' + searchString + '&safe_search=3&format=json&nojsoncallback=1';
    const googleUrl = 'https://www.googleapis.com/customsearch/v1?q=' + searchString + '&num=10&start=' + start + '&cx=' + process.env.googlecx + '&searchType=image&key=' + process.env.googleapi;

    // console.log(googleUrl);
    const socksAgent = new Socks.Agent({
            proxy: {
                ipaddress: fixieValues[2],
                port: fixieValues[3],
                type: 5,
                authentication: {
                    username: fixieValues[0],
                    password: fixieValues[1]
                }
            }
        },
        true, // true HTTPS server, false for HTTP server
        false // rejectUnauthorized option passed to tls.connect()
    );

    const googleImage = () => {
        return new Promise((resolve, reject) => {
            request({
                    method: 'get',
                    url: googleUrl,
                    agent: socksAgent
                },
                 (error, response, body) => {
                    if (!error && response.statusCode === 200) {
                        const jsonBody = JSON.parse(body);
                        if(jsonBody && jsonBody.items && jsonBody.items[pick] && jsonBody.items[pick].link) {
                            resolve(jsonBody.items[pick].link);
                        }else{
                            reject();
                        }
                    } else {
                        //google has the errorz
                        const jsonErrorBody = JSON.parse(body);
                        // console.log("Google error: ", jsonErrorBody.error.message);
                        reject();
                    }
                }).end('{}');
        });
    };

    const flickrImage = () => {
        return new Promise((resolve, reject) => {
            request({
                    method: 'get',
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
                            reject();
                        }
                    } else {
                        reject();
                    }
                }).end('{}');

        });
    };

    return new Promise((resolve, reject) => {
        googleImage()
            .then((url) => {
                //success on googles
                resolve(url)
            }).catch((err) => {
                flickrImage()
                    .then((url) => {
                        //success on flicka
                        resolve(url);
                    }).catch((err) => {
                        reject();
                });
        });
    });
};




