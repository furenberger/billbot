var request = require('request');
var Promise = require('bluebird');
var Socks = require('socks');

/*
    generalize the request call to the google search api (well it still depends on bot)
 */
module.exports = function(searchString) {
    const fixieUrl = process.env.FIXIE_SOCKS_HOST;
    const fixieValues = fixieUrl.split(new RegExp('[/(:\\/@)/]+'));

    //from 25 pages pick random number
    var start = Math.floor(Math.random() * 25);
    var pick = Math.floor(Math.random() * 10);

    var flickrUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + process.env.FLICKR_KEY + '&text=' + encodeURIComponent(searchString) + '&safe_search=3&format=json&nojsoncallback=1';
    var googleUrl = 'https://www.googleapis.com/customsearch/v1?q=' + encodeURIComponent(searchString) + '&num=10&start=' + start + '&cx=' + process.env.googlecx + '&searchType=image&key=' + process.env.googleapi;

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

    var googleImage = function () {
        return new Promise(function (resolve, reject) {
            request({
                    method: 'get',
                    url: googleUrl,
                    agent: socksAgent
                },
                function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        var jsonBody = JSON.parse(body);
                        resolve(jsonBody.items[pick].link);
                    } else {
                        //google has the errorz
                        var jsonErrorBody = JSON.parse(body);
                        console.log("Google error: ", jsonErrorBody.error.message);
                        reject();
                    }
                }).end('{}');
        });
    };

    var flickrImage = function () {
        return new Promise(function (resolve, reject) {
            request({
                    method: 'get',
                    url: flickrUrl
                },
                function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        var jsonBody = JSON.parse(body);
                        if(jsonBody && jsonBody.photos && jsonBody.photos.photo[pick]) {
                            var flickrImage = 'https://farm' + jsonBody.photos.photo[pick].farm + '.staticflickr.com/' + jsonBody.photos.photo[pick].server + '/' + jsonBody.photos.photo[pick].id + '_' + jsonBody.photos.photo[pick].secret + '.jpg';
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

    return new Promise(function (resolve, reject) {
        googleImage()
            .then(function (url) {
                //success on googles
                resolve(url)
            }).catch(function (err) {
                flickrImage()
                    .then(function(url){
                        //success on flicka
                        resolve(url);
                    }).catch(function(err){
                        reject();
                });
        });
    });
};




