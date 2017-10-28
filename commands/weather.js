'use strict';

// Require dependencies
var Forecast = require('forecast');
var NodeGeocoder = require('node-geocoder');

// Initialize the geocoder
var geocoder = NodeGeocoder({
    provider: 'google',
    apiKey: process.env.GOOGLE_API_KEY,
    // Optional depending on the providers
    httpAdapter: 'https', // Default
    formatter: null         // 'gpx', 'string', ...
});

// Initialize the forecast module
var forecast = new Forecast({
    service: 'darksky',
    key: process.env.DARKSKY_API_KEY,
    units: 'fahrenheit',
    cache: true,      // Cache API requests
    ttl: {            // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/
        minutes: 5,
        seconds: 0
    }
});

module.exports = function(bot) {

    bot.registerCommand(new RegExp('^weather *', 'i'), {displayName: 'weather {zipcode}'}, function(bot, params, message, slackbotCallback) {

        // initialize the repsonse object
        var resp = {
            text: null
        };

        if(!params[1]) {
            resp.text = 'I can haz address?';
            return slackbotCallback(null, resp);
        }

        // remove "weather"
        params.shift();
        var address = params.join(' ');

        geocoder.geocode(address)
          .then(function(geocodeRes) {

              forecast.get([geocodeRes[0].latitude, geocodeRes[0].longitude], function(err, weather) {

                  console.log(weather);

                  if(err) {
                      resp.text = 'Oh noooo! Unable to get teh forecast infoz';
                      return slackbotCallback(null, resp);
                  }

                  resp.attachments = [
                      {
                          title: weather.currently.temperature+"°",
                          pretext: weather.currently.summary,
                          fields: [
                               {
                                   "title": "feels like",
                                   "value": weather.currently.apparentTemperature+"°",
                                   "short": true
                               },
                               {
                                   "title": "Humidity",
                                   "value": weather.currently.humidity*100+"%",
                                   "short": true
                               },
                               {
                                   "title": "UV Index",
                                   "value": weather.currently.uvIndex+" of 10",
                                   "short": true
                               },
                               {
                                   "title": "Visibility",
                                   "value": weather.currently.visibility,
                                   "short": true
                               }
                           ]
                      }
                  ];

                  slackbotCallback(null, resp);
              });

          })
          .catch(function(err) {
              console.log(err);
              resp.text = 'Oh noooo! Unable to get weather for "'+address+'"';
              return slackbotCallback(null, resp);
          });

    });

};