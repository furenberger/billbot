/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


                                THE BILL BOT


 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
require('dotenv').load();

if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

console.log("TONE_ENABLED: " + process.env.TONE_ENABLED);
console.log("GOOGLE_API_ENABLED: " + process.env.GOOGLE_API_ENABLED);

var chuckNorris = require('./helper/chucknorris');
var emoji = require('./helper/emoji');
var insult = require('./helper/insult');
var watsonBot = require('./helper/watson');

var toneDetection = require('./addons/tone_detection');
var watson = require('watson-developer-cloud');

var Botkit = require('botkit');
var schedule = require('node-schedule');

var watsonMiddleware = require('botkit-middleware-watson')({
    username: process.env.CONVERSATION_USERNAME,
    password: process.env.CONVERSATION_PASSWORD,
    workspace_id: process.env.WORKSPACE_ID,
    version_date: '2017-02-03'
});

// Instantiate the Watson Tone Analyzer Service as per WDC 2.2.0
var toneAnalyzer = new watson.ToneAnalyzerV3({
    username: process.env.TONE_USERNAME,
    password: process.env.TONE_PASSWORD,
    version_date: '2016-05-19'
});

var slackController = Botkit.slackbot({
    debug: false,
    stats_optout: true
});

var slackBot = slackController.spawn({
    token: process.env.token
}).startRTM();

//dynamically pull in the skills!
var normalizedPath = require('path').join(__dirname, 'skills');
require('fs').readdirSync(normalizedPath).forEach(function(file) {
    require('./skills/' + file)(slackController);
});

//Bill becomes sentient on his own today at this time, every day rip on epeterik.
var billSay = schedule.scheduleJob('24 15 * * *', function(){
    insult().then(function(quote){
        slackBot.say(
            {
                text: "Hey epeterik, " + quote,
                channel: '#general' // a valid slack channel, group, mpim, or im ID
            }
        );

        slackBot.api.reactions.add({
            channel: '#general',
            name: 'mooning'
        }, function (err, res) {
            if (err) {
                bot.botkit.log('Failed to add emoji reaction :(', err);
            }
        });
    });
});

/*
 Start the 'Controller' for bills 'skills'
 */

//Its a friendly bot, say hi
slackController.hears(['hello', 'hi', 'hey'], 'direct_message,direct_mention,mention', function(bot, message) {
    //add an emoji
    emoji(bot, message, 'bill_emoji');

    //reply to the user, with the user name
    bot.api.users.info({user:message.user},function(err,response) {
        if(!err){
            var currentUser = response["user"];
            bot.reply(message,
                {
                    text: 'Hi ' + currentUser["name"] + "!!"
                }
            );
        }
    });
});

//you said <anything> time to get sassy
slackController.hears(['bill'],['ambient,direct_message,direct_mention,mention'],function(bot,message) {
    var text = message.text;
    var regEx = new RegExp("bill", "ig");

    text = text.replace(regEx, "");

    //call a promise based function (tone API) and then do work.
    toneDetection.getTone(text, toneAnalyzer)
        .then((function(tone){
           //tones are limited to anger, disgust, fear, joy, and sadness, neutral
            switch(tone){
                case 'anger':
                case 'disgust':
                {
                    insult().then(function(quote){
                        bot.reply(message, quote);
                    });
                    break;
                }
                case 'fear':
                {
                    chuckNorris()
                        .then(function(quote){
                            bot.reply(message, quote);
                        });
                    break;
                }
                case 'joy':
                {
                    watsonBot(bot, message, watsonMiddleware);
                    break;
                }
                case 'sadness':
                {
                    watsonBot(bot, message, watsonMiddleware);
                    break;
                }
                case 'neutral':
                {
                    emoji(bot, message);
                    break;
                }
                default:
                {
                    //we dont have to do something every time...
                    break;
                }

            }
        }));
});



