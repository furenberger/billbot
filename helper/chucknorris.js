'use strict';
const request = require('request');
const debug = require('debug')('billbot:billbot');

/*
 generalize the request call to the chuck norris api
 */
module.exports = () => {
    return new Promise((resolve, reject) => {
        request({
                method: 'get',
                url: 'https://api.chucknorris.io/jokes/random'
            },
            (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    const jsonBody = JSON.parse(body);
                    const quote = jsonBody.value;
                    let replacedQuote = quote.replace(new RegExp('Chuck Norris', 'gi'), 'Bill');
                    replacedQuote = quote.replace(new RegExp('Chuck', 'gi'), 'Bill');
                    resolve(replacedQuote);
                }else{
                    reject('error');
                }
            }).end('{}');
    });
};
