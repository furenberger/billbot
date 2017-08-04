'use strict';
const debug = require('debug')('billbot:emoji');
const randomnumber = require('../addons/randomnumber');

/*
    attach emoji to message
*/
module.exports = (bot, message, specific) => {
    const emoji = [
        'bill_emoji',
        'bill_emoji',
        'bill_emoji',
        'bill_emoji',
        'bill_emoji',
        'aliensguy',
        'awwyeah',
        'aw_yeah',
        'balloonface',
        'blondesassyparrot',
        'bob_ross',
        'briefcase_wanker',
        'challenge_accepted',
        'coolio',
        'crying_jordan',
        'crying_kim_kardashian',
        'deadpool',
        'dickbutt',
        'doom_flame_barrel',
        'doom_mad',
        'ermygerd',
        'facepalm',
        'evil',
        'excellent',
        'nicmoji_laugh',
        'mooning',
        'partyparrot',
        'hypnotoad',
        'hypnotoad2',
        'i_see_what_you_did_there',
        'imposibru',
        'you_dont_say',
        'captain_obvious',
        'companion_cube',
        'dealwithitparrot',
        'evil',
        'gronk',
        'hammer_time',
        'ohyeah',
        'ron_swanson',
        'thisisfine',
        'worst_ever'


    ];
    const index = randomnumber(0, emoji.length);
    let pickedEmoji = emoji[index];

    if(specific){
        pickedEmoji = specific;
    }

    console.log("emoji: " + pickedEmoji);

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: pickedEmoji
    }, (err, res) => {
        if (err) {
            debug('Failed to add emoji reaction :(', err);
        }
    });
};