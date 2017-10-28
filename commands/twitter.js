'use strict';

var Twitter = require("twitter");

var twitterClient = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

module.exports = function(bot) {

    bot.registerCommand(new RegExp('^twitter me *', 'i'), {displayName: 'twitter me {phrase}'}, function (bot, params, message, slackbotCallback) {

        var resp = {};

        let phrase = params.join(' ').replace('twitter me ', '');

        // grab the info from the api
        twitterClient.get('search/tweets', {q: phrase}, function(err, tweets, response) {

            if (err) {
                resp.text = 'Oh noooooooOh. Cant get ur tweeetz!';
                return slackbotCallback(null, resp);
            }

            resp.text = tweets.statuses[0].text;
            return slackbotCallback(null, resp);
        });

    });

};