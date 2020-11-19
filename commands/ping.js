const { embedColor } = require('../config.json');

module.exports = {
	name: 'ping',
	aliases: ['latency'],
	description: 'Send info about latency',
	usage: 'ping',
	guildOnly: false,
	cooldown: 1,
	args: false,
	execute(message, args, client) {
		let pingEmbed = {
		      "description": "Latency is "+(Date.now() - message.createdTimestamp)+" ms, Discord's API Latency is "+Math.round(client.ws.ping)+"ms.",
		      "color": embedColor,
		      "author": {
			"name": "Ping",
			"icon_url": "https://hazycora.com/whisker/assets/iconPing.png"
		      }
		    }
		
		message.channel.send({ embed: pingEmbed });
	},
};
