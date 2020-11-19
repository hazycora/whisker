const fetch = require('node-fetch');
let omdbToken = process.env.omdbToken;
const { embedColor, errorChannelID, logChannelID } = require('../config.json');

module.exports = {
	name: 'media',
	description: 'Get info about TV shows and movies',
	aliases: ['media', 'tv', 'films', 'film', 'movies', 'movie'],
	usage: 'media Thomas the Tank Engine',
	guildOnly: false,
	cooldown: 30,
	log: true, // true means this command already logs, no need to log again.
	args: true,
	execute(message, args, client) {
		let film = args.join(' '); 
		film = film.trim();
		mediaCommand(message, film, film, client);
	},
};

function mediaCommand(message, film, realFilm, client) {
	//this is not actually needed, but I am adding it anyways in case OMDb ever forces people to use plus signs for requests.
	let query = film.replace(/ /g, "plusSIGN");
	query = encodeURIComponent(query);
	query = query.replace(/plusSIGN/g, "+");

	fetch('http://www.omdbapi.com/?t='+query+'&apikey='+omdbToken)
		.then(res => res.json())
		.then((out) => {
		if (out.Response=="False") {
			if (film.toLowerCase().includes("and")) {
				let filmAmpersand = film.replace(/and/g, "&");
				mediaCommand(message, filmAmpersand, film);
				return;
			}
			let fullJson = JSON.stringify(out);
			if (fullJson.length > 8) { // 8 for testing
				fullJson = fullJson.substring(0,8)+"...";
			}
			
			client.channels.cache.get(errorChannelID).send('Small error. User used command "'+message.content+'" and output was this:\n```'+fullJson+'```');
			let errorEmbed = {
			      "title": "No media found.",
			      "description": "Most likely this media is not on IMDb. Just in case this was a bot error, a message will be sent to Whisker's developer/s.",
			      "color": embedColor,
			      "author": {
				"name": "Searching for \""+realFilm+"\"",
				"icon_url": "https://hazycora.com/whisker/assets/iconMedia.png"
			      }
			    }
			message.channel.send({ embed: errorEmbed });
			return;
		}
		let { Title, Plot, Actors, Director, Writer, Genre, Runtime, Ratings, Type, Production, Poster } = out;
		let Time = "N/A";
		if (Type=="series") {
			Time = "Years: "+out.Year;
		}else {
			Time = "Release Date: "+out.Released;
		}
		let embedExtra;
		if (Production==undefined) {
			embedExtra = "Genre: "+Genre+"\nRuntime: "+Runtime+"\n"+Time;
		}else{
			embedExtra = "Genre: "+Genre+"\nRuntime: "+Runtime+"\n"+Time+"\nProduction: "+Production;
		}

		let embedRatings = "";
		for (let i = 0; i < Ratings.length; i ++) {
			embedRatings += "\n"+Ratings[i].Source+": "+Ratings[i].Value
		}
		embedRatings = embedRatings.replace("\n", ""); //remove first line break

		const mediaEmbed = {
			"color": embedColor,
			"fields": [
			  {
			    "name": Title,
			    "value": Plot
			  },
			  {
			    "name": "Writers & Directors",
			    "value": "Director: "+Director+"\nWriter: "+Writer
			  },
			  {
			    "name": "Actors",
			    "value": Actors
			  },
			  {
			    "name": "Ratings",
			    "value": embedRatings
			  },
			  {
			    "name": "Extra Info",
			    "value": embedExtra
			  }
			],
			"author": {
			  "name": "Searching for \""+realFilm+"\"",
			  "icon_url": "https://hazycora.com/whisker/assets/iconMedia.png"
			},
			"thumbnail": {
			  "url": Poster
			}
		};
		//end of that whole object thing
		
		let fullJson = JSON.stringify(out);
		if (fullJson.length > 1700) { // character limit, could be higher but I don't care
			fullJson = fullJson.substring(0,1700)+"...";
		}
		client.channels.cache.get(logChannelID).send('User used media command "'+message.content+'" and output was this:\n```'+fullJson+'```');
		
		message.channel.send({ embed: mediaEmbed });
	}).catch(err => console.error(err));

}
