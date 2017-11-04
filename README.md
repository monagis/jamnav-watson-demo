# Jamnav Location API Chat Bot

This application demonstrates a simple chat bot using IBM Watson services and Jamnav API.

To view a demo of the app go to
<https://jamnav-watson-demo.mybluemix.net>

To customize this application you need to:
1. Create a [Bluemix Acccount][] 
1. Sign up with [Jamnav API][] 

## Customize this Bot 

1. [Install Node.js][]
1. cd into this project's root directory
1. Clone this repo `git clone https://github.com/leezie/jamnav-watson-demo.git`
1. Create [Watson Text to Speech service][] and [Watson Conversaino Service][] then copy the service credentials i.e username and password in `bot.js` file.
1. Run `npm install` to install the app's dependencies
1. Run `node app.js` to start the app
1. Access the running app in a browser locally at <http://localhost:6001>
1. Try asking Watson 'nearest ATM'
1. To deploy to bluemix, follow these [instructions][] on how to deploy from CLI , then change `manifest.yml` 

[Install Node.js]: https://nodejs.org/en/download/
[Bluemix Acccount]: https://console.bluemix.net/
[Jamnav API]: https://api.jamnav.com/auth/sign-up/
[Jamnav API]: https://api.jamnav.com/auth/hackathon-registration/
[Watson Text to Speech service]: https://www.ibm.com/watson/services/text-to-speech/
[Watson Conversaino Service]: https://console.bluemix.net/docs/services/conversation/index.html
[instructions]:https://console.bluemix.net/docs/manageapps/depapps.html#deployingapps