'use strict';

var shuffle = require('lodash/shuffle');

let responses = [
    'Did somebody say cheezburger?',
    'I can has cheezeburger?',
    'sup?',
    'oh hai! I didnt see you thar',
    'What do we want? Cheezburger. When do we wants it? NAO. :burger: :musical_note:'
];

var randomResponses = [];

function getRandomResponse() {

    if(!randomResponses.length > 0) {
        randomResponses = shuffle(responses);
    }

    return randomResponses.shift();
}

module.exports = function(bot) {

    bot.registerListener('cheezburger', function(bot, message, slackbotCallback) {

        var resp = {};
        let pattern = new RegExp('cheezburger');

        if (!message.text.match(pattern)) {
            return;
        }

        resp.text = getRandomResponse();
        slackbotCallback(null, resp);
    });

};