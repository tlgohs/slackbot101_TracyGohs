require('dotenv').config();

var Bot = require('../core/bot.js');

// create a bot
var bot = new Bot({
    token: process.env.BOT_TOKEN, // Add a bot https://gdi-slackbot101.slack.com/services/new/bot and put the token
    name: process.env.BOT_NAME
});

// register core commands
require('../core/commands')(bot);

// register any custom commands here
require('../commands/statuscat')(bot);
require('../commands/catme')(bot);
require('../commands/twitter')(bot);
require('../commands/weather')(bot);
require('../commands/dogme')(bot);
require('../commands/witches')(bot);


// register any custom listeners here
require('../listeners/cheezburger')(bot);
require('../listeners/halloween')(bot);

bot.run();