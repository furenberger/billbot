const debug = require('debug')('billbot:image');

const randomnumber = require('../addons/randomnumber');
const flickrImage = require('./image/flickrImage');
const googleImage = require('./image/googleImage');

/*
    generalize the request call to the google search api (well it still depends on bot)
 */
module.exports = (searchString) => {
    //from 25 pages pick random number
    const start = randomnumber(0, 25);
    const pick = randomnumber(0, 10);

    const flickrUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + process.env.FLICKR_KEY + '&text=' + searchString.trim() + '&safe_search=3&format=json&nojsoncallback=1';
    const googleUrl = 'https://www.googleapis.com/customsearch/v1?q=' + searchString.trim() + '&num=10&start=' + start + '&cx=' + process.env.googlecx + '&searchType=image&key=' + process.env.googleapi_open;  

    return new Promise((resolve, reject) => {
        googleImage(googleUrl, pick)
            .then((url) => {
                //success on googles
                resolve(url);
            }).catch((err) => {
                debug('the googles had issues:' + err);
                flickrImage(flickrUrl, pick)
                    .then((url) => {
                        //success on flicka
                        resolve(url);
                    }).catch((err) => {
                        reject();
                });
        });
    }).catch((error) => {
        debug('general promise error: ', error);
    });
};




