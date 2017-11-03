const request = require('request');
const debug = require('debug')('billbot:chucknorris');

/*
 generalize the request call to the chuck norris api
 */
module.exports = () => {
    return new Promise((resolve, reject) => {
        request({
                method: 'GET',
                url: 'https://api.chucknorris.io/jokes/random'
            },
            (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    const jsonBody = JSON.parse(body);
                    const quote = jsonBody.value;
                    let replacedQuote = quote.replace(new RegExp('Chuck Norris', 'gi'), 'Bill');
                    replacedQuote = replacedQuote.replace(new RegExp('Chuck', 'gi'), 'Bill');
                    resolve(replacedQuote);
                }else{
                    reject('error');
                }
            });
    }).catch((error) => {
        debug('promise error: ', error);
    });
};
