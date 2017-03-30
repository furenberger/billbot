/*
    attach emoji to message
*/
module.exports = function(bot, message, specific) {
    var emoji = [
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
        'you_dont_say'
    ];
    var index = Math.floor(Math.random() * emoji.length);
    var pickedEmoji = emoji[index];

    if(specific){
        pickedEmoji = specific;
    }

    console.log("emoji: " + pickedEmoji);

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: pickedEmoji
    }, function (err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });
}