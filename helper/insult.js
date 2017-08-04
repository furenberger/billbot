const request = require('request');
const cheerio = require('cheerio');
const debug = require('debug')('billbot:insult');
const randomnumber = require('../addons/randomnumber');

/*
 generalize the request call to the insult api
 */
module.exports = () => {
    let index = randomnumber(0, 3);

    switch (index) {
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
                            resolve(insult.trim());
                        } else {
                            reject(error);
                        }
                    }).end('{}');
            }).catch((error) => {
                debug('promise error: ', error);
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
                            resolve(insult.trim());
                        } else {
                            reject(error);
                        }
                    }).end('{}');
            }).catch((error) => {
                debug('promise error: ', error);
            });
        }
        case 2: {
            return new Promise((resolve, reject) => {
                request({
                        method: 'get',
                        url: 'http://www.pangloss.com/seidel/Shaker'
                    },
                    (error, response, body) => {
                        if (!error && response.statusCode === 200) {
                            const $ = cheerio.load(body);
                            const insult = $('p').first().text(); //get the text of the first p (the insult)
                            debug('insult', insult);
                            resolve(insult.trim());
                        } else {
                            reject(error);
                        }
                    }).end('{}');
            }).catch((error) => {
                debug('promise error: ', error);
            });
        }
        case 3: {
            return new Promise((resolve, reject) => {
                request({
                        method: 'get',
                        url: 'https://www.insult-generator.org/'
                    },
                    (error, response, body) => {
                        if (!error && response.statusCode === 200) {
                            const $ = cheerio.load(body);
                            const insult = $('.insult-text').text(); //get the text of the insult
                            debug('insult', insult);
                            resolve(insult.trim());
                        } else {
                            reject(error);
                        }
                    }).end('{}');
            }).catch((error) => {
                debug('promise error: ', error);
            });
        }
    }
};

