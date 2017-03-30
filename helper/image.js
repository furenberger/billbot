var request = require('request');

/*
    generalize the request call to the google search api (well it still depends on bot)
 */
module.exports = function(bot, message, searchString) {
    var start = Math.floor(Math.random() * 25);
    var url = 'https://www.googleapis.com/customsearch/v1?q='+searchString+'&num=10&start='+ start +'&cx='+ process.env.googlecx +'&searchType=image&key='+ process.env.googleapi;

    //console.log("generated URL"+ url);
    if(process.env.GOOGLE_API_ENABLED === 'true') {
        request({
                method: 'get',
                url: url
            },
            function (error, response, body) {
                //console.log("BODY:", body);
                if (!error && response.statusCode === 200) {
                    var pick = Math.floor(Math.random() * 10);
                    // console.log('BODY: ', body);

                    var jsonBody = JSON.parse(body);
                    // console.log('jsonbody', jsonBody);
                    // console.log('jsonbody', jsonBody.items[0].link);

                    bot.reply(message, jsonBody.items[pick].link);
                } else {
                    var jsonErrorBody = JSON.parse(body);
                    // console.log('else', jsonErrorBody.error.message)
                    bot.reply(message, jsonErrorBody.error.message);
                }
            }).end('{}');
    }else{
        bot.reply(message, "You must really love that...");
    }
};