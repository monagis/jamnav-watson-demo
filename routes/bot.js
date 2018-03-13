var express = require('express');
var router = express.Router();
var watson = require('watson-developer-cloud');
var request = require('request');
var text_to_speech = new watson.TextToSpeechV1 ({
    username: '52865592-04aa-478b-8430-36b6e28a321e',
    password: 'NdBp5lQ0rOEK'
});
var fs = require('fs');
var conversation = new watson.ConversationV1({
    username: '4a7b84dd-131c-4f53-8396-c0452911349c',
    password: 'W3Zo561MSQOs',
    path: { workspace_id: '15b3dc40-6409-40ab-af96-a6b204cae994' },
    version_date: '2018-02-16'
});
const util = require('util');

app = express()

function closest(array){
  var closest = array[0]
  for (var i = 1; i < array.length-1; i++) {
    if (array[i].properties.proximity.km < closest.properties.proximity.km){
      closest = array[i]
    }
  }
  console.log(util.inspect(closest, { showHidden: true, depth: null }))
  return closest
}
app.get('/', function (req, res) {
    res.render('index', { title: 'test' });
})

app.post('/', function (req, res) {

var params = {};
var latitude = req.body.lat;
var longitude = req.body.long;
var query = req.body.query;

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
        var headers = {
            'Authorization': 'Token e9c193619561e04d193238196d7307af9c36446c'
        };

        var options = {
            headers: headers
        };

        if (intent === 'Police_Station'){
            options['url'] = 'https://api-test.jamnav.com/v1/locations/nearby/?categories=Police Station&lat='+latitude+"&lng="+longitude
        }
        else if(intent === 'Fire_Station'){
            options['url'] = 'https://api-test.jamnav.com/v1/locations/nearby/?categories=Fire Dept&lat='+latitude+"&lng="+longitude
        }
        if (intent === "hello"){
          text_to_send = text_arry[0]
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
                  'features':'none'
                });
            });
          }else{
              request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body).features;
                count = JSON.parse(body).count;
                proximity = []
                data.forEach(function(entry) {
                    proximity.push(entry.properties.proximity.km);
                });

                closestPOI = closest(data)

                if(intent === "Police_Station"){
                    text_to_send = "The closest Police Station is "+closestPOI.properties.name+" and it is "+closestPOI.properties.proximity.km.toFixed(2)+"km away, they can be reached at "+closestPOI.properties.phone_number

                }
                else if(intent === "Fire_Station") {
                    text_to_send = "The closest Fire Station is "+closestPOI.properties.name+" and it is "+closestPOI.properties.proximity.km.toFixed(2)+"km away, they can be reached at "+closestPOI.properties.phone_number
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
                      'features':[closestPOI]
                    });
                });
            }else{
              console.log(response.statusCode)
            }
        });
      }
  }
});
});
module.exports = app;
