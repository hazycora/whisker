
const fetch = require('node-fetch');
let tokenMaps = process.env.mapsToken;
const { embedColor } = require('../config.json');

module.exports = {
	name: 'time',
	description: 'Get time zone in any location',
	usage: 'time California',
	guildOnly: false,
	cooldown: 5,
	args: true,
	execute(message, args) {
    const helpEmbed =     {
          "description": "**Commands:**",
          "color": 9338051,
          "fields": [
      {
        "name": "search",
        "value": "``w!search`` - search for information on a topic, eg: ``w!search NASA``"
      },
      {
        "name": "math",
        "value": "``w!math`` - solve simple arithmetic and simple algebra, eg: ``w!math 2x=10``"
      },
      {
        "name": "time",
        "value": "``w!time`` - get the current time in a specific place, eg: ``w!time New York City``"
      }
          ],
          "author": {
      "name": "Help!"
          }
    };
    message.channel.send({ embed: helpEmbed });
  },
}
