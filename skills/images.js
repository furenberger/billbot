var image = require('../helper/image');

/*
    Listen to the keywords (in the 'hears') and do a google image search based
 */
module.exports = function(controller){

    //sarah connor terminator genisys
    controller.hears(['sarah connor'],['ambient,direct_message'],function(bot,message) {
        image(bot, message, "sarah%20connor%20terminator%20genisys");
    });

    //trump
    controller.hears(['trump'],['ambient,direct_message'],function(bot,message) {
        image(bot, message, "trump");
    });

};