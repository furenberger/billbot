var request = require('request');
var Promise = require('bluebird');
var Socks = require('socks');

/*
    generalize the request call to the google search api (well it still depends on bot)
 */
module.exports = function(searchString) {

    const fixieUrl = process.env.FIXIE_SOCKS_HOST;
    const fixieValues = fixieUrl.split(new RegExp('[/(:\\/@)/]+'));

    return new Promise(function(resolve, reject) {

        const socksAgent = new Socks.Agent({
                proxy: {
                    ipaddress: fixieValues[2],
                    port: fixieValues[3],
                    type: 5,
                    authentication: {
                        username: fixieValues[0],
                        password: fixieValues[1]
                    }
                }},
            true, // true HTTPS server, false for HTTP server
            false // rejectUnauthorized option passed to tls.connect()
        );


        var start = Math.floor(Math.random() * 25);
        var url = 'https://www.googleapis.com/customsearch/v1?q=' + searchString + '&num=10&start=' + start + '&cx=' + process.env.googlecx + '&searchType=image&key=' + process.env.googleapi;

        if (process.env.GOOGLE_API_ENABLED === 'true') {
            request({
                    method: 'get',
                    url: url,
                    agent: socksAgent
                },
                function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        var pick = Math.floor(Math.random() * 10);

                        var jsonBody = JSON.parse(body);
                        resolve(jsonBody.items[pick].link);
                    } else {
                        var jsonErrorBody = JSON.parse(body);
                        resolve(jsonErrorBody.error.message);
                    }
                }).end('{}');
        } else {
            resolve('You must really love that...')
        }
    });
};