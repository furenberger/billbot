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
const giphy = require('./helper/giphy');
const quote = require('./helper/quote');
const speak = require('./helper/speak');

const randomnumber = require('./addons/randomnumber');

const toneDetection = require('./addons/tone_detection');
const watson = require('watson-developer-cloud');

const Botkit = require('botkit');
const schedule = require('node-schedule');

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

const CHANNELS = [
    {
        team     : 'weUsedToRunAnnuities',
        channel  : 'C4E3L7CQ6',
        name     : '#general'
    },
    {
        team     : 'furenberger',
        channel  : 'C4SKTL527',
        name     : '#bill_testing'
    }];

let activeChannel = 0;

const searchChannel = () => {
    // Figure out what channel we are on
    slackBot.api.channels.info(
        {
            channel: CHANNELS[activeChannel].channel
        },
        (err,response) => {
            if(err){
                debug('error looking at channel: ' + activeChannel);
                activeChannel = activeChannel + 1;
                return searchChannel();
            }

            debug('Found current channel (from list) ' + CHANNELS[activeChannel].team + ' ' + CHANNELS[activeChannel].channel + ' ' + CHANNELS[activeChannel].name);

            setTimeout(() => {
                giphy().then((url) => {
                    slackBot.say(
                        {
                            text: url,
                            channel: CHANNELS[activeChannel].channel
                        });
                });
            }, randomnumber(0, 30000));


            setTimeout(() => {
                quote().then((quote) => {
                    slackBot.say(
                        {
                            text: quote,
                            channel: CHANNELS[activeChannel].channel
                        }
                    )
                });
            }, randomnumber(0, 100000));

            //Bill becomes sentient on his own today at this time, every day rip on epeterik. '24 15 * * *'
            schedule.scheduleJob('47 15 * * *', () => {
                insult().then((quote) => {
                    slackBot.say(
                        {
                            text: "Hey epeterik, " + quote,
                            channel: CHANNELS[activeChannel].name
                        }
                        , (err, worker, message) => {
                            debug('ERR: ', err, 'WORK: ', worker, 'MSG: ', message);

                            slackBot.api.reactions.add({
                                channel: CHANNELS[activeChannel].name,
                                name: 'mooning',
                                timestamp: worker.message.ts
                            }, (err, res) => {
                                if (err) {
                                    debug('Failed to add emoji reaction :(', err);
                                }
                            });

                        });
                });
            });
        });
};

searchChannel();

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
            //tones are limited to anger, disgust, fear, joy, and sadness, neutral
            debug('tone:', tone);
            switch(tone){
                case 'anger':
                {
                    insult()
                        .then((quote) => {
                            bot.reply(message, quote);
                        });
                    break;
                }
                case 'disgust':
                {
                    quote()
                        .then((quote) => {
                            bot.reply(message, quote);
                        });
                    break;
                }
                case 'fear':
                {
                    chuckNorris()
                        .then((quote) => {
                            bot.reply(message, quote);
                        });
                    break;
                }
                case 'joy':
                {
                    speak()
                        .then((text) => {
                            bot.reply(message, text);
                        });
                    giphy()
                        .then((quote) => {
                            bot.reply(message, quote);
                        });
                    break;
                }
                case 'sadness':
                {
                    quote()
                        .then((quote) => {
                        bot.reply(message, quote);
                    });
                    break;
                }
                case 'neutral':
                {
                    speak()
                        .then((text) => {
                            bot.reply(message, text);
                        });
                    emoji(bot, message);
                    break;
                }
                default:
                {
                    speak()
                        .then((text) => {
                            bot.reply(message, text);
                        });
                    //we dont have to do something every time...
                    break;
                }

            }
        }));
});

