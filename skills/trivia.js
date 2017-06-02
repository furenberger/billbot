'use strict';
const debug = require('debug')('billbot:trivia');
const request = require('request');

/*
 TRIVIA!
 */
module.exports = (controller) => {
    controller.hears(['trivia'], 'ambient,direct_message,direct_mention,mention', (bot,message) => {

        getTrivia()
            .then((trivia) => {
                let answerList = trivia.incorrect_answers.concat(trivia.correct_answer);
                answerList = shuffle(answerList);

                const answers = answerList.join(', ');

                const question = trivia.question + "  " +  answers;

                // start a conversation to handle this response.
                bot.startConversation(message, (err,convo) => {

                    convo.addQuestion(question,[
                        {
                            pattern: trivia.correct_answer,
                            callback: (response,convo) => {
                                convo.say('WINNER!');
                                convo.next();
                            }
                        },
                        {
                            default: true,
                            callback: (response,convo) => {
                                // YOU GOT IT WRONG
                                convo.say('Fail.');
                                convo.repeat();
                                convo.next();
                            }
                        }
                    ],{},'default');

                })
            });
    });
};

const getTrivia = () => {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            url: 'https://opentdb.com/api.php?amount=1&type=multiple&encode=url3986'
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const parsedBody = JSON.parse(body);
                debug('results[0]: ', parsedBody.results[0]);

                let question =  mapQuestion(parsedBody.results[0]);

                debug('question: ', question);
                resolve(question);
            } else {
                debug('quote error: ', error);
                reject('error');
            }
        });
    }).catch((error) => {
        debug('trivia error: ' + error);
    });

    // const example = {
    //     "response_code": 0,
    //     "results": [{
    //         "category": "Entertainment: Video Games",
    //         "type": "multiple",
    //         "difficulty": "hard",
    //         "question": "What was the nickname of the original model for Half-Life&#039;s protagonist Gordon Freeman?",
    //         "correct_answer": "Ivan the Space Biker",
    //         "incorrect_answers": ["Gordon the Space Biker", "Ivan the Alien Biker", "Gordon the Alien Biker"]
    //     }]
    // };
};

const mapQuestion = (triviaDbQuestion) => {
    // debug('in: ' , triviaDbQuestion);
    triviaDbQuestion.answer = decodeURIComponent(triviaDbQuestion.correct_answer);
    triviaDbQuestion.question = decodeURIComponent(triviaDbQuestion.question);
    triviaDbQuestion.points = triviaDbQuestion.difficulty === 'hard' ? 3 : triviaDbQuestion.difficulty === 'medium' ? 2 : 1;
    triviaDbQuestion.category = decodeURIComponent(triviaDbQuestion.category);
    // debug('out: ' , triviaDbQuestion);

    return triviaDbQuestion
};

// The de-facto unbiased shuffle algorithm is the Fisher-Yates (aka Knuth) Shuffle.
const shuffle = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};
