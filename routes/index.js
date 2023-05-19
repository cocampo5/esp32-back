var express = require('express');
var router = express.Router();
var mqtt = require('mqtt')
var fs = require('fs')
const process = require('process');

var currentValue = 0

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'faq', sensorValue: currentValue });
});

/* GET sensor. */
router.get('/sensor', function(req, res, next) {
  res.send((currentValue));
});

console.log('building client');
console.log(process.argv)
const client = mqtt.connect(
    'mqtts://' + process.argv[2] + ':8883',
    {
        key:  fs.readFileSync(process.argv[3]),
        cert: fs.readFileSync(process.argv[4]),
        ca: [ fs.readFileSync(process.argv[5]) ],
        protocolId: 'MQTT',
        protocolVersion: 5,
    }
);

client.on('connect', function () {
  console.log('success');
});

client.subscribe('esp32/pub', function(error, granted) {
  console.log(error);
  console.log(granted);
})

client.on('message', (topic, message) => {
  console.log(JSON.parse(message.toString()).sensor)
  currentValue = JSON.parse(message.toString())
  console.log(message.toString());
});

module.exports = router;

