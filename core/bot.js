'use strict';

var merge = require('lodash/merge');
var BaseBot = require('slackbots');

class Bot extends BaseBot {

    /**
     * @param {object} params
     * @constructor
     */
    constructor(params) {

        super(params);

        this.commands = [];
        this.listeners = [];
    }

    run() {
        this.on('message', this.onMessage);
    }

    /**
     *
     * @param name
     * @param params
     * @param func
     */
    registerCommand(name, params, func) {

        var self = this;

        // if no params passed, reconfigure
        if (typeof params == 'function') {
            func = params;
            var params = [];
        }

        let command = {name: name, func: func, params: params};
        self.commands.push(command);
    }

    /**
     *
     * @param name
     * @param params
     * @param func
     */
    registerListener(name, func) {

        var self = this;
        let listener = {name: name, func: func};
        self.listeners.push(listener);
    }

    /**
     *
     * @param name
     * @returns {*}
     */
    findCommand(name) {

        return this.commands.filter(function (item) {

            var matches = [];
            var values = [item.name];

            if (typeof item.params.alias !== 'undefined') {
                values = values.concat(item.params.alias);
            }

            values.forEach(function (v) {

                if (v instanceof RegExp && name.match(v)) {
                    matches.push(v);
                }
                else if (v == name) {
                    matches.push(v);
                }
            });

            return matches.length > 0;
        })[0];
    }

    /**
     *
     * @param message
     * @returns {*}
     */
    parseCommand(message) {

        var self = this;

        var msgParts = message.text.split(' ');
        var botName = msgParts.shift();

        // everything else is the actual command; with a little cleanup
        var commandName = msgParts.join(' ').toLowerCase().trim();

        if (typeof commandName == 'undefined' || commandName.length == 0) {
            return;
        }

        var command = self.findCommand(commandName);

        if (typeof command == 'undefined' || !command) {
            return false;
        }

        command.value = commandName;
        command.args = msgParts;

        return command;
    }

    /**
     *
     * @param message
     *
     * {
     *      type: 'message',
     *      channel: 'G7Q7BRBJA',
     *      user: 'U7F4NJALS',
     *      text: 'test',
     *      ts: '1508942414.000260',
     *      source_team: 'T7F6A2H4L',
     *      team: 'T7F6A2H4L'
     *  }
     *
     * @returns {*}
     *
     */
    onMessage(message) {

        // delegate by message type
        if(this.isChatMessage(message)) {
            return this.handleChatMessage(message);
        }
    }

    /**
     * Determine if the message is a "message"
     *
     * This seems confusing, but the api returns 'user_typing' and 'presence_change'
     * as messages, but we only care about text messages.
     *
     * @param message
     * @returns {boolean}
     */
    isChatMessage(message) {
        return message.type === 'message' && Boolean(message.text);
    }

    isChannelConversation(message) {
        return typeof message.channel === 'string' && message.channel[0] === 'C';
    }

    isGroupConversation(message) {
        return typeof message.channel === 'string' && message.channel[0] === 'G';
    }

    isPrivateConversation(message) {
        return typeof message.channel === 'string' && message.channel[0] === 'D';
    }

    isFromSelf(message) {
        return message.user === this.self.id;
    }

    isMentioningSelf(message) {
        return message.text.indexOf('<@'+this.self.id+'>') > -1;
    }

    getChannelById(channelId) {
        return this.channels.filter(function (item) {
            return item.id === channelId;
        })[0];
    }

    getGroupById(groupId) {
        return this.groups.filter(function (item) {
            return item.id === groupId;
        })[0];
    }

    getUserById(userId) {
        var userId = userId.toUpperCase();
        return this.users.filter(function (item) {
            return item.id === userId;
        })[0];
    }

    /**
     *
     * @param message
     */
    handleChatMessage(message) {

        var self = this;

        // Don't talk to yourself; people will think you're crazy
        if(self.isFromSelf(message)) {
            return;
        }

        // parse the command from the message
        var command = self.parseCommand(message);

        // if we can't find a command, AND the bot was addressed directly, let the user know
        if(!command && self.isMentioningSelf(message)) {
            return self.reply(message, {text: 'I can has proper commandz?'});
        }

        if(command && self.isMentioningSelf(message)) {

            // call the command
            command.func.call(self, self, command.args, message, function (err, resp) {

                if (err) throw err;

                self.reply(message, resp);
            });
        }

        // fire any listeners too
        this.listeners.forEach(function (listener) {
            listener.func.call(self, self, message, function(err, resp) {
                if(err) throw err;
                self.reply(message, resp);
            });
        });
    }

    /**
     *
     * @param originalMessage
     * @param resp
     */
    reply(originalMessage, resp) {

        var defaultParams = {as_user: true};
        var params = merge(resp, defaultParams);
        console.log(resp, params);

        var forum = this.getProperForum(originalMessage);
        forum.method.call(this, forum.actor.name, null, params);
    }

    getProperForum(msg) {

        var self = this;
        var actor = null;
        var method = null;

        if(self.isChannelConversation(msg)) {
            actor = self.getChannelById(msg.channel);
            method = self.postMessageToChannel;
        }
        else if(self.isGroupConversation(msg)) {
            actor = self.getGroupById(msg.channel);
            method = self.postMessageToGroup;
        }
        else if(self.isPrivateConversation(msg)) {
            actor = self.getUserById(msg.user);
            method = self.postMessageToUser;
        }

        return {actor: actor, 'method': method};
    }

}

module.exports = Bot;