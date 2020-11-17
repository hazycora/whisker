const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
const fetch = require('node-fetch');
const ddg = require('ddg');
const mathsteps = require('mathsteps');
let embedColor = 9338051;
let tokenMaps = process.env.mapsToken;

client.once('ready', () => {
	client.user.setActivity('w!help, made by hazycora', { type: 'LISTENING' });
	console.log('Ready!');
});

client.on('message', message => {
	if (!message.content.startsWith("w!") || message.author.bot) return;
	
	const command = message.content.slice(2).trim();
	
	try {
		if (command.startsWith("search")) {

			let search = command.slice(6).trim();

			let options = {
				"useragent": "Whisker",
				"no_redirects": "1",
				"no_html": "0",
			}

			let description = "There is no description for this search term.";
			let heading = 'DuckDuckGo search for "'+search+'":';
			let footer = "There has been an error.";
			let source = "";
			let sourceURL = "";
			let sourceImage = "";

			ddg.query(search, options, function(err, data){
				source = data.AbstractSource;
				sourceURL = data.AbstractURL;
				let bottom;
				let thumbnail;
				if (data.AbstractText!="") {
					let desc = data.AbstractText;
					description = "**Info:** "+desc.substring(0,200)+" ...\n*"+sourceURL+"*";
					bottom = 'Info from '+source;
					thumbnail = "https://duckduckgo.com"+data.Image;
				}else{
					if(data.RelatedTopics.length>0) {
						let desc = data.RelatedTopics[0].Text;
						description = "**Info:** "+desc.substring(0,200)+"";
						bottom = 'Info from DuckDuckGo';
						thumbnail = "https://duckduckgo.com"+data.RelatedTopics[0].Icon.URL;
					}else{
						description = "Nothing was found for this search term.";
						bottom = 'No idea how to help with that one... Be sure not to form the search term as a question.';
					}
				}
				heading = data.Heading;
				//console.log("In function, source: "+source+"\nurl: "+sourceURL+"\ndescription: "+description+"\nheading: "+heading);
                                console.log(thumbnail);
				const searchEmbed = {
					color: embedColor,
					author: {
						name: 'Searching for "'+search+'"',
						icon_url: 'https://external-content.duckduckgo.com/ip3/duckduckgo.com.ico',
					},
					description: description,
					thumbnail: {
						url: thumbnail,
					},
	// 				fields: [
	// 					{
	// 						name: 'Websites',
	// 						value: 'Websites that may be relevent to your search:',
	// 					},
	// 					{
	// 						name: 'No websites',
	// 						value: 'There are no websites for this search.',
	// 					},
	// 				],
					footer: {
						text: bottom,
					},
				};



				message.channel.send({ embed: searchEmbed });
			});

		}

		if (command.startsWith("math")) {
			let question = command.slice(4).trim();
			var regExp = /[a-zA-Z]/g;

			if(regExp.test(question)){
				/* do something if letters are found in your string */

				const steps = mathsteps.solveEquation(question);

				let answer = "";

				steps.forEach(step => {
					answer += "\nbefore change: " + step.oldEquation.ascii();
					answer += "\nchange: " + step.changeType;
					answer += "\nafter change: " + step.newEquation.ascii();
				});

				const mathEmbed = {
					color: embedColor,
					author: {
						name: 'Solve math "'+question+'"',
						icon_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/GNOME_Calculator_icon_2018.svg/128px-GNOME_Calculator_icon_2018.svg.png',
					},
					description: answer,
					footer: {
						text: "Hope it worked!",
					},
				};
				message.channel.send({ embed: mathEmbed });
			} else {
				/* do something if letters are not found in your string */
				let answer;
				answer = "Solution: "+eval(question);
				const mathEmbed = {
					color: embedColor,
					author: {
						name: 'Solve math "'+question+'"',
						icon_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/GNOME_Calculator_icon_2018.svg/128px-GNOME_Calculator_icon_2018.svg.png',
					},
					description: answer,
					footer: {
						text: "Hope it worked!",
					},
				};
				message.channel.send({ embed: mathEmbed });
			}

		}
		if (command.startsWith("time")) {
			let location = command.slice(4).trim();
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
							icon_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/OOjs_UI_icon_clock-invert.svg/200px-OOjs_UI_icon_clock-invert.svg.png',
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
			
		}
		if (command.startsWith("help")) {
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
		}
	}catch (error) {
	  console.error(error);
	  // expected output: ReferenceError: nonExistentFunction is not defined
	  // Note - error messages will vary depending on browser
	}

});

let tokenDiscord = process.env.discordToken;
client.login(tokenDiscord);
