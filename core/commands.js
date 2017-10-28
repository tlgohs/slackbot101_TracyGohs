'use strict';

module.exports = function(bot) {

    bot.registerCommand(new RegExp(':taco:|:pizza:|:hotdog:'), {hideHelp: true}, function(bot, params, message, slackbotCallback) {
        var resp = {};
        resp.text = 'Om nom nom!';
        slackbotCallback(null, resp);
    });

    bot.registerCommand('test', {alias: ['hello', 'hello?', 'hey', 'yo'], hideHelp: true}, function(bot, params, message, slackbotCallback) {
        var resp = {};
        resp.text = 'I\'m up and running. What else do you want from me? Type `@'+bot.self.name+' help` to list available commands.';
        slackbotCallback(null, resp);
    });

    bot.registerCommand('help', {alias: ['halp', 'hap', '?']}, function(bot, params, message, slackbotCallback) {

        var resp = {};
        resp.text = '*Available commands:*'+"\n";

        bot.commands.forEach(function(cmd) {

            if(typeof cmd.params.hideHelp !== 'undefined' && cmd.params.hideHelp) {
                return;
            }

            if(typeof cmd.params.displayName != 'undefined') {
                resp.text += '`'+cmd.params.displayName+'`';
            }
            else {
                resp.text += '`'+cmd.name+'`';
            }
            if(typeof cmd.params.alias !== 'undefined') {
                resp.text += ' or ';
                cmd.params.alias.forEach(function(alias) {
                    resp.text += '`'+alias+'` ';
                });
            }

            resp.text += "\n";
        });

        slackbotCallback(null, resp);
    });

};