'use strict';
const debug = require('debug')('billbot:images');
const image = require('../helper/image');

/*
    Listen to the keywords (in the 'hears') and do a google image search based
 */
module.exports = (controller) => {
    //sarah connor terminator genisys
    controller.hears(['sarah connor'],['ambient,direct_message'],(bot,message) => {
        image("sarah%20connor%20terminator%20genisys")
            .then(function (image) {
                bot.reply(message, image);
            }).catch(function (err) {
                bot.api.reactions.add({
                    timestamp: message.ts,
                    channel: message.channel,
                    name: 'aw_yeah'
                }, function (err, res) {
                    if (err) {
                        debug('Failed to add emoji reaction :(', err);
                    }
                });
        });
    });

    //trump
    controller.hears(['trump'],['ambient,direct_message'],(bot,message) => {
        image('funny%20cat')
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
    });

    //allow user to say image {search}
    controller.hears(['image'],['ambient,direct_message'],(bot,message) => {
        let text = message.text;
        const regEx = new RegExp("image", "i");

        text = text.replace(regEx, "");

        if(text !== '') {
            image(text)
                .then((image) => {
                    bot.reply(message, image);
                }).catch((err) => {
                bot.api.reactions.add({
                    timestamp: message.ts,
                    channel: message.channel,
                    name: 'middle_finger'
                }, (err, res) => {
                    if (err) {
                        debug('Failed to add emoji reaction :(', err);
                    }
                });
            });
        }
    });
};