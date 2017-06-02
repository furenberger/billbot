'use strict';
const debug = require('debug')('billbot:giphy');
const request = require('request');

module.exports = () => {
    return new Promise((resolve, reject) => {
        request("http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&fmt=json&rating=pg-13", (error, response, body) => {
            const data = JSON.parse(body);

            const gifUrl = data.data.fixed_height_downsampled_url;
            debug('url:'+gifUrl);

            resolve(gifUrl);
        });
    }).catch((error) => {
        debug('promise error: ', error);
    });
};