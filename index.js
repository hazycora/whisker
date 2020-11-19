const fs = require('fs');
const Discord = require('discord.js');
const { prefix, errorChannelID, logChannelID } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const fetch = require('node-fetch');
const ddg = require('ddg');
const mathsteps = require('mathsteps');
let embedColor = 9338051;
let tokenMaps = process.env.mapsToken;

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
	client.user.setActivity('w!help, made by hazycora', { type: 'LISTENING' });
	console.log('Ready!');
	client.channels.cache.get(logChannelID).send('Bot finished restarting.');
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	client.channels.cache.get(logChannelID).send('A user used command "'+message.content+'"');
	
	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('I can\'t execute that command inside DMs!');
	}
	
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix} ${command.usage}\``;
		}
		
		return message.channel.send(reply);
	}

	
	if (!command) return;

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	
	try {
		command.execute(message, args, client);
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command.');
		client.channels.cache.get(errorChannelID).send('Error. User used command "'+message.content+'"');
	}


});

let tokenDiscord = process.env.discordToken;
client.login(tokenDiscord);
