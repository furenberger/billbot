const debug = require('debug')('billbot:randomnumber');

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
module.exports = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};