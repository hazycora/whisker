const { embedColor } = require('../config.json');

module.exports = {
	name: 'ping',
	aliases: ['latency'],
	description: 'Send info about latency',
	usage: 'ping',
	guildOnly: false,
	cooldown: 1,
	args: false,
	execute(message, args) {
		let pingEmbed = {
		      "description": "Latency is "+(Date.now() - message.createdTimestamp)+" ms.",
		      "color": embedColor,
		      "footer": {
			"text": "This is the latency of the bot plus the latency of Discord itself."
		      },
		      "author": {
			"name": "Ping",
			"icon_url": "https://hazycora.com/whisker/assets/iconPing.png"
		      }
		    }
		
		message.channel.send({ embed: pingEmbed });
	},
};
