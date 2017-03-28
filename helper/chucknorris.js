var request = require('request');

/*
 generalize the request call to the chuck norris api
 */
module.exports = function(bot, message) {
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
};
