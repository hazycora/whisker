const fetch = require('node-fetch');
let tokenMaps = process.env.mapsToken;
const { embedColor } = require('../config.json');

module.exports = {
	name: 'time',
	description: 'Get time zone in any location',
	aliases: ['timezone'],
	usage: 'time California',
	guildOnly: false,
	cooldown: 10,
	args: true,
	execute(message, args) {
    let location = args.join(' '); 
    location = location.trim();
    let query = location.replace(/ /g, "plusSIGN");
    query = encodeURIComponent(query);
    query = query.replace(/plusSIGN/g, "+");
    let latitude = "42.023131";
    let longitude = "-87.52366099999999";
    let now = new Date().getTime();
    now = Math.floor(now/1000);

    fetch('https://maps.googleapis.com/maps/api/geocode/json?address='+query+'&key='+tokenMaps)
        .then(res => res.json())
        .then((out) => {
      latitude = out.results[0].geometry.location.lat;
      longitude = out.results[0].geometry.location.lng;

      fetch('https://maps.googleapis.com/maps/api/timezone/json?location='+out.results[0].geometry.location.lat+','+out.results[0].geometry.location.lng+'&timestamp='+now+'&key='+tokenMaps)
          .then(res => res.json())
          .then((out) => {
        let offsets = out.dstOffset * 1000 + out.rawOffset * 1000;
                  let localdate = new Date(now * 1000 + offsets); // Date object containing current time of Tokyo (timestamp + dstOffset + rawOffset)
        //console.log('Time info: ', out);
        let timeAsString = localdate.toUTCString();
        timeAsString = timeAsString.slice(0, -4);
        console.log(timeAsString) // Display current date and time
        const timeEmbed = {
          color: embedColor,
          author: {
            name: 'Time in "'+location+'"',
            icon_url: 'https://hazycora.com/whisker/assets/iconTime.png',
          },
          description: timeAsString,
          footer: {
            text: "Timezone and location info from Google Maps",
          },
        };
        message.channel.send({ embed: timeEmbed });
      }).catch(err => console.error(err));

    }).catch(err => console.error(err));

    console.log('URL: https://maps.googleapis.com/maps/api/timezone/json?location='+latitude+','+longitude+'&timestamp='+now+'&key='+tokenMaps);
	},
};
