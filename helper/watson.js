'use strict';
const debug = require('debug')('billbot:watson');

/*
    use watson to have some dialog
 */
module.exports = (bot, message, watsonMiddleware) => {
    watsonMiddleware.interpret(bot, message, (err) => {
        if (!err) {
            debug('Slack message output for \'watson\': ', message.watsonData.output.text);
            if(message.watsonData.output.text.join('\n').trim() !== '') {
                bot.reply(message, message.watsonData.output.text.join('\n'));
            }
        }
    });
};