'use strict';

var giphy = require('giphy-api')(process.env.GIPHY_API_KEY);
var shuffle = require('lodash/shuffle');
var witches = [];

module.exports = function(bot) {

    bot.registerCommand('witch me', function (bot, params, message, slackbotCallback) {

        var sendResponse = function(witch) {

            var resp = {};

            resp.text = null;

            resp.attachments = [
                {
                    title: typeof witch.title.length !== 'undefined' && witch.title.length > 0 ? witch.title : 'ur witch',
                    image_url: witch.images.original.url,
                }
            ];

            return slackbotCallback(null, resp);
        }

        // pull a witch from the reserves
        if(witches.length > 0) {
            return sendResponse(witches.shift());
        }

        // grab some witch from giphy api
        giphy.search({ q:'witch', limit: 100 }).then(function (apiResponse) {

            // shuffle dem witches, and save for future requests
            witches = shuffle(apiResponse.data);

            return sendResponse(dogs.shift());
        });

    });

};