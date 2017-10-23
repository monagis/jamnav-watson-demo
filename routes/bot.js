var express = require('express');
var router = express.Router();
var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var assert = require('assert');
var googleplaces = require('googleplaces');
var text_to_speech = new TextToSpeechV1 ({
    username: '318fe234-f034-4b26-8d0c-7b181c0084f5',
    password: '2bu1CzqikxsV'
});
var config = require('../config.js');
var fs = require('fs');
var googlePlaces = new googleplaces(config.apiKey, config.outputFormat);


/* GET home page. */

router.route('/')
    .get(function (req, res, next) {
        res.render('index', { title: 'test' });
        console.log("Reached endpoint /bot")

})
    .post(function (req, res) {
        var params = {};
        var query = req.body.query;
        console.log(query);
        var parameters = {
            query: query
        };

        googlePlaces.textSearch(parameters, function (error, response) {

            if (error) throw error;
            assert.equal(response.status, "OK", "Place details request response status is OK");
            var no_of_atms = response.results.length;
            var text_to_send = "There are "+ no_of_atms + parameters.query;

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

        });


    });


module.exports = router;
