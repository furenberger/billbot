const request = require('request');
const cheerio = require('cheerio');
const debug = require('debug')('billbot:insult');
const randomnumber = require('../addons/randomnumber');

/*
 generalize the request call to the insult api
 */
module.exports = () => {
    const index = randomnumber(0, 1);
    debug('index :' + index);
    switch (index){
        case 0: {
            return new Promise((resolve, reject) => {
                //http://autoinsult.datahamster.com/index.php?style=3
                //<?xml version="1.0" encoding="utf-8" ?><xjx><cmd n="as" t="insult" p="innerHTML"><![CDATA[You gruesome box of hideous dog barf]]></cmd></xjx>
                request({
                        method: 'get',
                        url: 'http://autoinsult.datahamster.com/scripts/webinsult.server.php?xajax=generate_insult&xajaxargs[]=3&xajaxr=1490819484403'
                    },
                    (error, response, body) => {
                        if (!error && response.statusCode === 200) {
                            debug('BODY: ', body);
                            const insult = body.substring(body.indexOf('[CDATA[') + 7, body.indexOf(']]'));
                            resolve(insult);
                        } else {
                            reject(error);
                        }
                    }).end('{}');
            });
        }
        case 1: {
            return new Promise((resolve, reject) => {
                request({
                        method: 'get',
                        url: 'http://www.robietherobot.com/insult-generator.htm'
                    },
                    (error, response, body) => {
                        if (!error && response.statusCode === 200) {
                            const $ = cheerio.load(body);
                            const insult = $('h1').last().text(); //get the text of the last h1 (the insult)
                            debug('insult', insult);
                            resolve(insult);
                        } else {
                            reject(error);
                        }
                    }).end('{}');
            });
        }
    }
};

