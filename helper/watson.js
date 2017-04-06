/*
    use watson to have some dialog
 */
module.exports = function(bot, message, watsonMiddleware){
    watsonMiddleware.interpret(bot, message, function(err) {
        if (!err) {
            //console.log('Slack message output for \'watson\': ', message.watsonData.output.text);
            bot.reply(message, message.watsonData.output.text.join('\n'));
        }
    });
};