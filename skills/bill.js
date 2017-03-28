var request = require('request');
var chuckNorris = require('../helper/chucknorris');
var emoji = require('../helper/emoji');

/*
    'Controller' for bills 'skills'
 */
module.exports = function(controller){

    //Its a friendly bot, say hi
    controller.hears(['hello', 'hi', 'hey'], 'direct_message,direct_mention,mention', function(bot, message) {

        //add an emoji
        emoji(bot, message);

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

    //you said his name!
    controller.hears(['bill'],['ambient,direct_message,direct_mention,mention'],function(bot,message) {

        // do something 'random' when you talk about bill...
        // var randomNumber = Math.floor(Math.random() * 5);
        var randomNumber = 1;
        switch (randomNumber) {
            default:
                //say something 'clever' about yourself
                chuckNorris(bot, message);

                break;
            case 2:
                //emoji it!
                emoji(bot, message);
                break;

            case 1:
                bot.startConversation(message, function (err, convo) {
                    if (!err) {
                        // create a path for when a user says YES
                        convo.addMessage({
                            text: getResponse('yes')
                        }, 'yes_thread');

                        // create a path for when a user says NO
                        convo.addMessage({
                            text: getResponse('no')
                        }, 'no_thread');

                        // create a path where neither option was matched
                        // this message has an action field, which directs botkit to go back to the `default` thread after sending this message.
                        convo.addMessage({
                            text: 'Sorry, I did not understand.',
                            action: 'default'
                        }, 'bad_response');


                        // Create a yes/no question in the default thread...
                        convo.ask('Want to hear more about Bill?', [
                            {
                                pattern: bot.utterances.yes,
                                callback: function (response, convo) {
                                    convo.gotoThread('yes_thread');
                                }
                            },
                            {
                                pattern: bot.utterances.no,
                                callback: function (response, convo) {
                                    convo.gotoThread('no_thread');
                                }
                            },
                            {
                                default: true,
                                callback: function (response, convo) {
                                    convo.gotoThread('bad_response');
                                }
                            }
                        ]);

                    }
                });
                break;
        }

    });

    var getResponse = function(thread){
        var yes = [
            'Bill enjoys longs walks on the beach, spending time with teammates and sitting as close to Karl as possible.',
            'I could tell you more but mother mutual will not allow it.',
            'BIll is Karl\'s best friend!',
            'Bill does what Bill wants.  Or Karl.',
            'Bill has enough time.  Bill can do it.'
        ];

        var no = [
            'Too bad he is super exciting.',
            'All your bases are belong to us.',
            'Fine be that way...',
            'What would you say you do here?'
        ];

        if(thread === 'yes'){
            return yes[Math.floor(Math.random() * yes.length)];

        }else if(thread === 'no'){
            return no[Math.floor(Math.random() * no.length)];

        }else{
            return '';

        }
    }
};