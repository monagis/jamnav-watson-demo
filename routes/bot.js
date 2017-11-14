var express = require('express');
var router = express.Router();
var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var request = require('request');
//var assert = require('assert');
//var googleplaces = require('googleplaces');
var text_to_speech = new TextToSpeechV1 ({
    username: '5bd6c555-a485-41a1-8854-bddfdd00e16f',
    password: 'z5YmLkDYh5Ve'
});
//var config = require('../config.js');
var fs = require('fs');
var conversation = new ConversationV1({
    username: '4ebede69-4162-427f-916d-47631a69bd03',
    password: 'JyoAV6amHoIv',
    path: { workspace_id: 'acd6a15a-6be0-4a92-b0a9-8a3bd49adb4e' },
    version: 'v1',
    version_date: '2017-05-26'
});
const util = require('util');


//var googlePlaces = new googleplaces(config.apiKey, config.outputFormat);

/* GET home page. */
app = express()

app.get('/', function (req, res) {
    res.render('index', { title: 'test' });
    console.log("Reached endpoint /bot")
})

app.post('/', function (req, res) {

var params = {};
var latitude = req.body.lat;
var longitude = req.body.long;
var query = req.body.query;

console.log("Text sent by user: "+query);
/*/*var parameters = {
query: query
};*/

 conversation.message({
  input: {'text': query}
 },  function(err, response) {
  if (err)
    console.log('error:', err);
  else
  var text_arry = response.output.text;
            // Get intent
  if (response.intents.length > 0){
    var intent = response.intents[0].intent;
        var text_to_send;
        var mytext = text_arry[Math.floor(Math.random() * text_arry.length)];
        console.log(intent)
        console.log(text_arry)
        var headers = {
            'Authorization': 'Token 475c505a594ac7112c9efe4e3a7a4b0ee52ab689'

        };

        var options = {
            headers: headers
        };

        if (intent === 'Police_Station'){
            options['url'] = 'https://api.jamnav.com/v1.0/locations/nearby/?categories=Police Station&lat='+latitude+"&lng="+longitude
        }
        else if(intent === 'Fire_Station'){
            options['url'] = 'https://api.jamnav.com/v1.0/locations/nearby/?categories=Fire Dept&lat='+latitude+"&lng="+longitude
        }

        console.log(options)
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body).features;
                console.log(util.inspect(data, { showHidden: true, depth: null }));

                // if(intent === "Police_Station"){
                //     text_to_send = mytext.replace("Number", filtered.length.toString());

                // }
                // else if(intent === "Fire_Station") {
                //     text_to_send = text_arry[Math.floor(Math.random() * text_arry.length)];

                // }


                res.send(data);


                // params = {
                //     text: text_to_send,
                //     voice: 'en-US_AllisonVoice',
                //     accept: 'audio/mp3'
                // };
                // text_to_speech.synthesize(params).on('error', function(error) {
                //     console.log('Error:', error);
                // }).pipe(fs.createWriteStream('public/voice.mp3')).on('finish', function () {
                //     console.log("Finished writing the file");
                //     res.json({
                //       "audio-file": "check the audio file",
                //       "features": filtered
                //     });
                // });
            }else{
              console.log(response.statusCode)
            }
        });

  }
});

});





module.exports = app;
