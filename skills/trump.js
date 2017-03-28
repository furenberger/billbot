var request = require('request');

module.exports = function(controller){

    controller.hears(['trump'],['ambient'],function(bot,message) {
        var start = Math.floor(Math.random() * 100);
        var url = 'https://www.googleapis.com/customsearch/v1?q=trump&num=10&start='+ start +'&cx=012059744610064128764%3Aocxi4odvnto&searchType=image&key=AIzaSyCvWsdLdIbTDhCJrj1GfNKijANwFXtseXc';

        console.log(url);
        request({
                method: 'get',
                url: url
            },
            function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var pick = Math.floor(Math.random() * 10);
                    // console.log('BODY: ', body);

                    var jsonBody = JSON.parse(body);
                    // console.log('jsonbody', jsonBody);
                    // console.log('jsonbody', jsonBody.items[0].link);

                    bot.reply(message, jsonBody.items[pick].link);
                }
            }).end('{}');
    });

};