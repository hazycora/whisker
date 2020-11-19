const { embedColor } = require('../config.json');

module.exports = {
	name: 'ping',
	aliases: ['latency'],
	description: 'Send info about latency',
	usage: 'ping',
	guildOnly: true,
	cooldown: 5,
	args: false,
	execute(message, args) {
		let pingEmbed = {
		      "description": "Latency is "+(Date.now() - message.createdTimestamp)+" ms. API Latency is "+Math.round(Client.ws.ping)+" ms",
		      "color": embedColor,
		      "author": {
			"name": "Ping",
			"icon_url": "https://hazycora.com/whisker/assets/iconPing.png"
		      }
		    }
		
		message.channel.send();
	},
};
