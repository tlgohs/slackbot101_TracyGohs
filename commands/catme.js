'use strict';

var giphy = require('giphy-api')(process.env.GIPHY_API_KEY);
var shuffle = require('lodash/shuffle');
var cats = [];

module.exports = function(bot) {

    bot.registerCommand('cat me', function (bot, params, message, slackbotCallback) {

        var sendResponse = function(cat) {

            var resp = {};

            resp.text = null;

            resp.attachments = [
                {
                    title: typeof cat.title.length !== 'undefined' && cat.title.length > 0 ? cat.title : 'ur cat',
                    image_url: cat.images.original.url,
                }
            ];

            return slackbotCallback(null, resp);
        }

        // pull a cat from the reserves
        if(cats.length > 0) {
            return sendResponse(cats.shift());
        }

        // grab some cats from giphy api
        giphy.search({ q:'space cat', limit: 100 }).then(function (apiResponse) {

            // shuffle dem cats, and save for future requests
            cats = shuffle(apiResponse.data);

            return sendResponse(cats.shift());
        });

    });

};