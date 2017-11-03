var express = require('express');
var router = express.Router();
var watson = require('watson-developer-cloud');
var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var request = require('request');
//var assert = require('assert');
//var googleplaces = require('googleplaces');
var text_to_speech = new TextToSpeechV1 ({
    username: '318fe234-f034-4b26-8d0c-7b181c0084f5',
    password: '2bu1CzqikxsV'
});
//var config = require('../config.js');
var fs = require('fs');
var conversation = watson.conversation({
    username: '9caa628c-72c4-40b5-acb3-ebe23a14197c',
    password: 'RtW4nzC6Fl0H',
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
                    'Authorization': 'Token 0500aa8225ea4e5a2a1052334d712907b5265c51'

                };

                var options = {
                    url: 'https://api.jamnav.com/v1/locations/nearby/?lat='+latitude+'&lng='+longitude,
                    headers: headers
                };

                request(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var data = JSON.parse(body);
                        var count = data.features.length.toString();
                        if(intent === "findATM"){
                            text_to_send = mytext.replace("Number", count);

                        }
                        else if(intent === "Greetings") {
                            text_to_send = text_arry[Math.floor(Math.random() * text_arry.length)];

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
                            res.json({"audio-file": "check the audio file"});
                        });
                    }
                });

                /*if(intent === "findATM"){
                    //Get GPS Coordinates
                    //Send request to Jamnav API


                }
                else if(intent === "Greetings") {
                    text_to_send = text_arry[Math.floor(Math.random() * text_arry.length)];

                }*/



        });



    });




module.exports = router;
