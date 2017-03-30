var request = require('request');

module.exports = function(bot, message){
    //http://autoinsult.datahamster.com/index.php?style=3
    //<?xml version="1.0" encoding="utf-8" ?><xjx><cmd n="as" t="insult" p="innerHTML"><![CDATA[You gruesome box of hideous dog barf]]></cmd></xjx>
    request({
            method: 'get',
            url: 'http://autoinsult.datahamster.com/scripts/webinsult.server.php?xajax=generate_insult&xajaxargs[]=3&xajaxr=1490819484403'
        },
        function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log('BODY: ', body);
                var insult = body.substring(body.indexOf('[CDATA[')+7,body.indexOf(']]'));
                bot.reply(message, insult);
            }
        }).end('{}');
};