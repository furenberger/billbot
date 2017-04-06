var request = require('request');
var Promise = require('bluebird');

/*
 generalize the request call to the chuck norris api
 */
module.exports = function() {
    return new Promise(function(resolve, reject) {
        request({
                method: 'get',
                url: 'https://api.chucknorris.io/jokes/random'
            },
            function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var jsonBody = JSON.parse(body);
                    var quote = jsonBody.value;
                    var replacedQuote = quote.replace(new RegExp('Chuck Norris', 'gi'), 'Bill');
                    resolve(replacedQuote);
                }else{
                    reject('error');
                }
            }).end('{}');
    });
};
