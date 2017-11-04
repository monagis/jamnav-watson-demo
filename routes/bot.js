var express = require('express');
var router = express.Router();
var watson = require('watson-developer-cloud');
var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var request = require('request');
//var assert = require('assert');
//var googleplaces = require('googleplaces');
var text_to_speech = new TextToSpeechV1 ({
    username: '<yourusername>',
    password: '<yourpassword>'
});
//var config = require('../config.js');
var fs = require('fs');
var conversation = watson.conversation({
    username: '<yourusername>',
    password: '<yourpassword>',
    version: 'v1',
    version_date: '2017-05-26'
});


//var googlePlaces = new googleplaces(config.apiKey, config.outputFormat);

/* GET home page. */

router.route('/')
    .get(function (req, res, next) {
        res.render('index', { title: 'test' });
        console.log("Reached endpoint /bot")

})
    .post(function (req, res) {
        var params = {};
        var latitude = req.body.lat;
        var longitude = req.body.long;
        var query = req.body.query;

        console.log("Text sent by user: "+query);
        /*var parameters = {
            query: query
        };*/

        conversation.message({
            workspace_id: '10e1a750-5418-44bb-ab4f-b1a32776e6a7',
            input: {'text': query}
        },  function(err, response) {
            if (err)
                console.log('error:', err);
            else
                var text_arry = response.output.text;
                // Get intent
                var intent = response.intents[0].intent;
                var text_to_send;
                var mytext = text_arry[Math.floor(Math.random() * text_arry.length)];

                var headers = {
                    'Authorization': 'Token <yourtoken>'

                };

                var options = {
                    url: 'https://api.jamnav.com/v1/locations/nearby/?lat='+latitude+'&lng='+longitude,
                    headers: headers
                };

                request(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var data = JSON.parse(body).features;
                        var filtered = [];
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].properties.name == "N.C.B. A.T.M. (National Commercial Bank)") {
                                filtered.push(data[i]);
                            }
                        }
                        var lowest = Number.POSITIVE_INFINITY;
                        var highest = Number.NEGATIVE_INFINITY;
                        var tmp;
                        for (var i=filtered.length-1; i>=0; i--) {
                            tmp = filtered[i].properties.proximity.km;
                            if (tmp < lowest) lowest = tmp;
                            if (tmp > highest) highest = tmp;
                        }

                        if(intent === "numberATMs"){
                            text_to_send = mytext.replace("Number", filtered.length.toString());

                        }
                        else if(intent === "Greetings") {
                            text_to_send = text_arry[Math.floor(Math.random() * text_arry.length)];

                        }
                        else if (intent === "nearATM"){
                            text_to_send = mytext.replace("number", lowest.toFixed(2));

                        }

                        params = {
                            text: text_to_send,
                            voice: 'en-US_AllisonVoice',
                            accept: 'audio/mp3'
                        };
                        text_to_speech.synthesize(params).on('error', function(error) {
                            console.log('Error:', error);
                        }).pipe(fs.createWriteStream('public/voice.mp3')).on('finish', function () {
                            console.log("Finished writing the file");
                            res.json({
                              "audio-file": "check the audio file",
                              "features": filtered
                            });
                        });
                    }
                });




        });



    });





module.exports = router;
