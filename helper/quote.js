const request = require('request');
const debug = require('debug')('billbot:quote');
const cheerio = require('cheerio');
const randomnumber = require('../addons/randomnumber');

/*
 generalize the request call to the brainyquotes api
 */
module.exports = () => {
    const page = randomnumber(0, 4);
    const item = randomnumber(0, 26);

    const options = {
        method: 'POST',
        url: 'https://www.brainyquote.com/api/inf',
        headers: {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'x-requested-with': 'XMLHttpRequest',
            accept: 'application/json'
        },
        body: {
            typ: 'topic',
            langc: 'en',
            v: '6.8.6:2268970',
            ab: 'b',
            pg: page,
            id: 't:132622',
            vid: '7b363d749b4c7c684ace871c8a75f8e6',
            m: 0
        },
        json: true
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    // debug('quote: ', body.content);
                    const $ = cheerio.load(body.content);
                    const quote = $('a[title="view quote"]').eq(item).text(); //get the text of the title view quote and a random number from that HTML
                    debug('quote: ' + quote);
                    resolve(quote);
                } else {
                    debug('quote error: ', error);
                    reject('error');
                }
            });
    }).catch((error) => {
        debug('promise error: ', error);
    });
};
