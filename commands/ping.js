module.exports = {
	name: 'ping',
	aliases: ['ping!'],
	description: 'Ping!',
	usage: 'ping',
	guildOnly: true,
	cooldown: 5,
	args: false,
	execute(message, args) {
		message.channel.send('Pong.');
	},
};
