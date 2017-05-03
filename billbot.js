/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


                                THE BILL BOT


 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
'use strict';
const debug = require('debug')('billbot:billbot');
require('dotenv').load();

if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

const request = require('request');

console.log("TONE_ENABLED: " + process.env.TONE_ENABLED);
console.log("GOOGLE_API_ENABLED: " + process.env.GOOGLE_API_ENABLED);

const chuckNorris = require('./helper/chucknorris');
const emoji = require('./helper/emoji');
const insult = require('./helper/insult');
const watsonBot = require('./helper/watson');

const toneDetection = require('./addons/tone_detection');
const watson = require('watson-developer-cloud');

const Botkit = require('botkit');
const schedule = require('node-schedule');

const watsonMiddleware = require('botkit-middleware-watson')({
    username: process.env.CONVERSATION_USERNAME,
    password: process.env.CONVERSATION_PASSWORD,
    workspace_id: process.env.WORKSPACE_ID,
    version_date: '2017-02-03'
});

// Instantiate the Watson Tone Analyzer Service as per WDC 2.2.0
const toneAnalyzer = new watson.ToneAnalyzerV3({
    username: process.env.TONE_USERNAME,
    password: process.env.TONE_PASSWORD,
    version_date: '2016-05-19'
});

const slackController = Botkit.slackbot({
    debug: false,
    stats_optout: true
});

const slackBot = slackController.spawn({
    token: process.env.token
}).startRTM();

//dynamically pull in the skills!
const normalizedPath = require('path').join(__dirname, 'skills');
require('fs').readdirSync(normalizedPath).forEach(function(file) {
    require('./skills/' + file)(slackController);
});

//Bill becomes sentient on his own today at this time, every day rip on epeterik.
const billSay = schedule.scheduleJob('24 15 * * *', () => {
    insult().then((quote) => {
        slackBot.say(
            {
                text: "Hey epeterik, " + quote,
                channel: '#general' // a valid slack channel, group, mpim, or im ID
            }
        );

        slackBot.api.reactions.add({
            channel: '#general',
            name: 'mooning'
        }, (err, res) => {
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
slackController.hears(['hello', 'hi', 'hey'], 'direct_message,direct_mention,mention', (bot, message) => {
    //add an emoji
    emoji(bot, message, 'bill_emoji');

    //reply to the user, with the user name
    bot.api.users.info({user:message.user}, (err,response) => {
        if(!err){
            const currentUser = response["user"];
            bot.reply(message,
                {
                    text: 'Hi ' + currentUser["name"] + "!!"
                }
            );
        }
    });
});

//you said <anything> time to get sassy
slackController.hears(['bill'],['ambient,direct_message,direct_mention,mention'], (bot,message) => {
    let text = message.text;
    const regEx = new RegExp("bill", "ig");

    text = text.replace(regEx, "");

    //call a promise based function (tone API) and then do work.
    toneDetection.getTone(text, toneAnalyzer)
        .then(((tone) => {
            watsonBot(bot, message, watsonMiddleware);

            //tones are limited to anger, disgust, fear, joy, and sadness, neutral
            switch(tone){
                case 'anger':
                case 'disgust':
                {
                    insult()
                        .then((quote) => {
                            bot.reply(message, quote);
                        });
                    break;
                }
                case 'fear':
                case 'joy':
                {
                    chuckNorris()
                        .then((quote) => {
                            bot.reply(message, quote);
                        });
                    break;
                }
                case 'sadness':
                {
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



