'use strict';
const debug = require('debug')('billbot:giphy');
const request = require('request');
const randomnumber = require('../addons/randomnumber');

module.exports = () => {
    return new Promise((resolve, reject) => {
        request("http://api.giphy.com/v1/gifs/search?q=fail&api_key=dc6zaTOxFJmzC", (error, response, body) => {
            const data = JSON.parse(body);
            const rando = randomnumber(0, data.data.length);

            const gifUrl = data.data[rando].images.downsized.url;

            resolve(gifUrl);
        });
    });
};