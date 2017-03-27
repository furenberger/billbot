var request = require('request');

module.exports = function(controller){

    controller.hears(['bill'],['ambient'],function(bot,message) {

        // do something 'random' when you talk about bill...
        var randomNumber = Math.floor(Math.random() * 3);
        switch (randomNumber) {
            case 1:
                request({
                        method: 'get',
                        url: 'https://api.chucknorris.io/jokes/random'
                    },
                    function (error, response, body) {
                        if (!error && response.statusCode === 200) {
                            //console.log('BODY: ', body);

                            var jsonBody = JSON.parse(body);
                            // console.log(jsonBody)

                            var quote = jsonBody.value;
                            var replacedQuote = quote.replace(new RegExp('Chuck Norris', 'gi'), 'Bill');
                            bot.reply(message, replacedQuote);
                        }
                    }).end('{}');
                break;
            case 2:
                bot.api.reactions.add({
                    timestamp: message.ts,
                    channel: message.channel,
                    name: 'robot_face',
                }, function (err, res) {
                    if (err) {
                        bot.botkit.log('Failed to add emoji reaction :(', err);
                    }
                });
                break;

            default:
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