'use strict';
const debug = require('debug')('billbot:images');
const image = require('../helper/image');

/*
    Listen to the keywords (in the 'hears') and do a google image search based
 */
module.exports = (controller) => {
    //sarah connor terminator genisys
    controller.hears(['sarah connor'],['ambient,direct_message'],(bot,message) => {
        getImage("sarah%20connor%20terminator%20genisys", bot, message);
    });

    //trump
    controller.hears(['trump'],['ambient,direct_message'],(bot,message) => {
        getImage('funny%20cat', bot, message);

    });

    //donald
    controller.hears(['donald'],['ambient,direct_message'],(bot,message) => {
        getImage('meme', bot, message);
    });

    //karl
    controller.hears(['karl'],['ambient,direct_message'],(bot,message) => {
        getImage('karl schroepfer', bot, message);
    });

    //eric
    controller.hears(['eric'],['ambient,direct_message'],(bot,message) => {
        getImage('metamucil', bot, message);
    });

    //allow user to say image {search}
    controller.hears(['image'],['ambient,direct_message'],(bot,message) => {
        let text = message.text;
        const regEx = new RegExp("image", "i");

        text = text.replace(regEx, "");

        if(text !== '') {
            getImage(text, bot, message);
        }
    });
};

const getImage = (search, bot, message) => {
    image(search)
        .then((image) => {
            bot.reply(message, image);
        }).catch((err) => {
        bot.api.reactions.add({
            timestamp: message.ts,
            channel: message.channel,
            name: 'finger_hole'
        }, (err, res)  =>{
            if (err) {
                debug('Failed to add emoji reaction :(', err);
            }
        });
    });
};