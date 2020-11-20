
const fetch = require('node-fetch');
let tokenMaps = process.env.mapsToken;
const { embedColor } = require('../config.json');

module.exports = {
	name: 'help',
	aliases: ['commands'],
	description: 'list the commands',
	usage: 'help',
	guildOnly: false,
	cooldown: 1,
	args: false,
	execute(message, args) {
    const helpEmbed =     { //Media - find information about a movie or show, eg: "w!media Coraline"
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
      },
      {
        "name": "media",
        "value": "``w!media`` - find information about a movie or show, eg: ``w!media Coraline``"
      },
          ],
          "author": {
      "name": "Help!"
          }
    };
    message.channel.send({ embed: helpEmbed });
  },
}
