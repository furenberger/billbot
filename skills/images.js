var image = require('../helper/image');

/*
    Listen to the keywords (in the 'hears') and do a google image search based
 */
module.exports = function(controller){

    //sarah connor terminator genisys
    controller.hears(['sarah connor'],['ambient,direct_message'],function(bot,message) {
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
                        bot.botkit.log('Failed to add emoji reaction :(', err);
                    }
                });
        });
    });

    //trump
    controller.hears(['trump'],['ambient,direct_message'],function(bot,message) {
        image("trump")
            .then(function (image) {
                bot.reply(message, image);
            }).catch(function (err) {
                bot.api.reactions.add({
                    timestamp: message.ts,
                    channel: message.channel,
                    name: 'finger_hole'
                }, function (err, res) {
                    if (err) {
                        bot.botkit.log('Failed to add emoji reaction :(', err);
                    }
                });
        });
    });

    //allow user to say image {search}
    controller.hears(['image'],['ambient,direct_message'],function(bot,message) {
        var text = message.text;
        var regEx = new RegExp("image", "i");

        text = text.replace(regEx, "");

        if(text !== '') {
            image(text)
                .then(function (image) {
                    bot.reply(message, image);
                }).catch(function(err){
                bot.api.reactions.add({
                    timestamp: message.ts,
                    channel: message.channel,
                    name: 'middle_finger'
                }, function (err, res) {
                    if (err) {
                        bot.botkit.log('Failed to add emoji reaction :(', err);
                    }
                });
            });
        }
    });
};