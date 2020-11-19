const fetch = require('node-fetch');
let omdbToken = process.env.omdbToken;
const { embedColor } = require('../config.json');

module.exports = {
	name: 'media',
	description: 'Get info about TV shows and movies',
	aliases: ['media', 'tv', 'films', 'film', 'movies', 'movie'],
	usage: 'media Thomas the Tank Engine',
	guildOnly: false,
	cooldown: 5,
	args: true,
	execute(message, args) {
		let film = args.join(' '); 
		film = film.trim();
		//this is not actually needed, but I am adding it anyways in case OMDb ever forces people to use plus signs for requests.
		let query = film.replace(/ /g, "plusSIGN");
		query = encodeURIComponent(query);
		query = query.replace(/plusSIGN/g, "+");

		fetch('http://www.omdbapi.com/?t='+query+'&apikey='+omdbToken)
			.then(res => res.json())
			.then((out) => {
			let { Title, Plot, Actors, Director, Writer, Genre, Runtime, Ratings, Type, Production, Poster } = out;
			let Time = "N/A";
			if (Type=="series") {
				Time = "Years: "+out.Years;
			}else {
				Time = "Years: "+out.Released;
			}
			let embedExtra;
			if (Production==undefined) {
				embedExtra = "Genre: "+Genre+"\nRuntime: "+Runtime+"\nYears: "+Time;
			}else{
				embedExtra = "Genre: "+Genre+"\nRuntime: "+Runtime+"\nYears: "+Time+"\nProduction: "+Production;
			}
			
			let embedRatings = "";
			for (let i = 0; i < Ratings.length; i ++) {
				embedRatings += "\n"+Ratings[i].Source+": "+Ratings[i].Value
			}
			embedRatings = embedRatings.replace("\n", ""); //remove first line break

			const timeEmbed = {
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
				  "name": "Searching for \""+film+"\"",
				  "icon_url": "https://cdn.onlinewebfonts.com/svg/img_129504.png"
				},
				"thumbnail": {
				  "url": Poster
				}
			};
			//end of that whole object thing

			message.channel.send({ embed: timeEmbed });
		}).catch(err => console.error(err));

	},
};
