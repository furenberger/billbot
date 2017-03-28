var request = require('request');

module.exports = function(controller){

    controller.hears(['trump'],['ambient,direct_message'],function(bot,message) {
        var start = Math.floor(Math.random() * 100);
        var url = 'https://www.googleapis.com/customsearch/v1?q=trump&num=10&start='+ start +'&cx='+ process.env.googlecx +'&searchType=image&key='+process.env.googleapi;

        //console.log("generated URL"+ url);
        request({
                method: 'get',
                url: url
            },
            function (error, response, body) {
                console.log("BODY:", body);
                if (!error && response.statusCode === 200) {
                    var pick = Math.floor(Math.random() * 10);
                    // console.log('BODY: ', body);

                    var jsonBody = JSON.parse(body);
                    // console.log('jsonbody', jsonBody);
                    // console.log('jsonbody', jsonBody.items[0].link);

                    bot.reply(message, jsonBody.items[pick].link);
                }else{
                    var jsonErrorBody = JSON.parse(body);
                    console.log('else' , jsonErrorBody)
                }
            }).end('{}');
    });

};