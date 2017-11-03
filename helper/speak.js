const debug = require('debug')('billbot:speak');
const getPhrase = require('../addons/phrases');

module.exports = () => {
    return new Promise((resolve, reject) => {
        resolve(getPhrase());
    }).catch((error) => {
        debug('promise error: ', error);
    });
};