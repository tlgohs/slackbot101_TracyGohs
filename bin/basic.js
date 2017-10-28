require('dotenv').config();

var SlackBot = require('slackbots');

// create a bot
var bot = new SlackBot({
    token: process.env.BOT_TOKEN, // Add a bot https://gdi-slackbot101.slack.com/services/new/bot and put the token
    name: process.env.BOT_NAME
});

bot.on('start', function() {
    
    console.log('STARTED');

    // more information about additional params https://api.slack.com/methods/chat.postMessage
    var params = {
        as_user: true
    };
    
    // define channel, where bot exist. You can adjust it there https://my.slack.com/services 
    bot.postMessageToChannel('general', 'oh hai I didn\t see you thar!', params);
    
    // // define existing username instead of 'user_name'
    bot.postMessageToUser('katie', 'i\'m in your interwebs messing with yur firewalz!', params);
    
});