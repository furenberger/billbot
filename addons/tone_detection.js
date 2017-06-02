'use strict';
const debug = require('debug')('billbot:tone_detection');

/**
 * Labels for the tone categories returned by the Watson Tone Analyzer
 */
const EMOTION_TONE_LABEL = 'emotion_tone';

/**
 * Thresholds for identifying meaningful tones returned by the Watson Tone
 * Analyzer. Current values are based on the recommendations made by the Watson
 * Tone Analyzer at
 * https://www.ibm.com/watson/developercloud/doc/tone-analyzer/understanding-tone.shtml
 * These thresholds can be adjusted to client/domain requirements.
 */
const PRIMARY_EMOTION_SCORE_THRESHOLD = 0.5;

const getTone = (text, toneAnalyzer) => {
    return new Promise((resolve, reject) => {
        if(process.env.TONE_ENABLED === 'true') {
            //API call to tone analyzer
            toneAnalyzer.tone({
                text: text
            }, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    let emotionTone = '';
                    let emotionToneSimple = '';
                    // Extract the tones - emotion, language and social
                    if (data && data.document_tone) {
                        data.document_tone.tone_categories.forEach((toneCategory) => {
                            if (toneCategory.category_id === EMOTION_TONE_LABEL) {
                                emotionTone = toneCategory;
                            }
                        });

                        emotionToneSimple = getEmotionTone(emotionTone);
                    }

                    resolve(emotionToneSimple);
                }
            });
        }else{
            resolve('neutral');
        }
    }).catch((error) => {
        debug('promise error: ', error);
    });
};

//this comes back with a ton of things... lets simplify it
const getEmotionTone = (emotionTone) => {
    let maxScore = 0.0;
    let primaryEmotion = null;
    let primaryEmotionScore = null;

    emotionTone.tones.forEach((tone) => {
        if (tone.score > maxScore) {
            maxScore = tone.score;
            primaryEmotion = tone.tone_name.toLowerCase();
            primaryEmotionScore = tone.score;
        }
    });

    if (maxScore <= PRIMARY_EMOTION_SCORE_THRESHOLD) {
        primaryEmotion = 'neutral';
        primaryEmotionScore = null;
    }

    //just return that emotion
    return primaryEmotion;
};

/**
 * Public functions for this module
 */
module.exports = {
    getTone
};
