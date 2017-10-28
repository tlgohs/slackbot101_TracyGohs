'use strict';

var giphy = require('giphy-api')(process.env.GIPHY_API_KEY);
var shuffle = require('lodash/shuffle');
var dogs = [];

module.exports = function(bot) {

    bot.registerCommand('dog me', function (bot, params, message, slackbotCallback) {

        var sendResponse = function(dog) {

            var resp = {};

            resp.text = null;

            resp.attachments = [
                {
                    title: typeof dog.title.length !== 'undefined' && dog.title.length > 0 ? dog.title : 'ur dog',
                    image_url: dog.images.original.url,
                }
            ];

            return slackbotCallback(null, resp);
        }

        // pull a dog from the reserves
        if(dogs.length > 0) {
            return sendResponse(dogs.shift());
        }

        // grab some dog from giphy api
        giphy.search({ q:'dog', limit: 100 }).then(function (apiResponse) {

            // shuffle dem dogs, and save for future requests
            dogs = shuffle(apiResponse.data);

            return sendResponse(dogs.shift());
        });

    });

};