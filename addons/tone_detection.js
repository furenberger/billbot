var Promise = require('bluebird');

/**
 * Labels for the tone categories returned by the Watson Tone Analyzer
 */
var EMOTION_TONE_LABEL = 'emotion_tone';

/**
 * Thresholds for identifying meaningful tones returned by the Watson Tone
 * Analyzer. Current values are based on the recommendations made by the Watson
 * Tone Analyzer at
 * https://www.ibm.com/watson/developercloud/doc/tone-analyzer/understanding-tone.shtml
 * These thresholds can be adjusted to client/domain requirements.
 */
var PRIMARY_EMOTION_SCORE_THRESHOLD = 0.5;


/**
 * Public functions for this module
 */
module.exports = {
    getTone: getTone
};


function getTone(text, toneAnalyzer){
    return new Promise(function(resolve, reject) {
        if(process.env.TONE_ENABLED === 'true') {
            //API call to tone analyzer
            toneAnalyzer.tone({
                text: text
            }, function (error, data) {
                if (error) {
                    reject(error);
                } else {
                    // Extract the tones - emotion, language and social
                    if (data && data.document_tone) {
                        data.document_tone.tone_categories.forEach(function (toneCategory) {
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
    });
}

//this comes back with a ton of things... lets simplify it
function getEmotionTone(emotionTone) {
    var maxScore = 0.0;
    var primaryEmotion = null;
    var primaryEmotionScore = null;

    emotionTone.tones.forEach(function(tone) {
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
}