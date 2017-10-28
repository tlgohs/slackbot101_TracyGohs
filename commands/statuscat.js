'use strict';

module.exports = function(bot) {

    bot.registerCommand(new RegExp('^status cat *', 'i'), {displayName: 'status cat {code}'}, function (bot, params, message, slackbotCallback) {

        var resp = {};
        let code = params.join(' ').replace('status cat ', '');

        // basic validation
        if (code >= 600 || code < 100) {
            resp.text = 'ur doin it wrong';
            return slackbotCallback(null, resp);
        }

        resp.text = null;
        resp.attachments = [
            {
                title: code,
                image_url: 'https://http.cat/'+code,
            }
        ];

        return slackbotCallback(null, resp);
    });

};