'use strict';

var shuffle = require('lodash/shuffle');

let responses = [
    'Boo!!',
    'Trick or Treat',
    'sup?',
    'Happy Halloween',
    'Whats up witches?'
];

var randomResponses = [];

function getRandomResponse() {

    if(!randomResponses.length > 0) {
        randomResponses = shuffle(responses);
    }

    return randomResponses.shift();
}

module.exports = function(bot) {

    bot.registerListener('halloween', function(bot, message, slackbotCallback) {

        var resp = {};
        let pattern = new RegExp('halloween');

        if (!message.text.match(pattern)) {
            return;
        }

        resp.text = getRandomResponse();
        slackbotCallback(null, resp);
    });

};