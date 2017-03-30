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

var request = require('request');
var chuckNorris = require('./helper/chucknorris');
var emoji = require('./helper/emoji');
var insult = require('./helper/insult');
var watsonBot = require('./helper/watson');
var toneDetection = require('./addons/tone_detection');
var watson = require('watson-developer-cloud');
var Botkit = require('botkit');

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


/*
 Start the 'Controller' for bills 'skills'
 */

//Its a friendly bot, say hi
slackController.hears(['hello', 'hi', 'hey'], 'direct_message,direct_mention,mention', function(bot, message) {
    console.log('Slack message received for \'hi\': ', message.text);

    //add an emoji
    emoji(bot, message, 'bill_emoji');

    //reply to the user, with the user name
    bot.api.users.info({user:message.user},function(err,response) {
        // console.log('user info');
        if(!err){
            var currentUser = response["user"];
            // console.log(currentUser["name"]);
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
    console.log('Slack message received for \'watson\': ', message.text);

    var text = message.text;
    var searchMask = "bill";
    var regEx = new RegExp(searchMask, "ig");
    var replaceMask = "";

    text = text.replace(regEx, replaceMask);

    //call a promise based function (tone API) and then do work.
    toneDetection.getTone(text, toneAnalyzer)
        .then((function(tone){
           console.log('result: ', tone);

           //tones are limited to anger, disgust, fear, joy, and sadness, neutral

            switch(tone){
                case 'anger':
                case 'disgust':
                {
                    insult(bot, message);
                    break;
                }
                case 'fear':
                {
                    chuckNorris(bot, message);
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



