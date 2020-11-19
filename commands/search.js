const ddg = require('ddg');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'search',
	aliases: ['what\'s'],
	description: 'Search for a topic',
	usage: 'search searchTerm',
	guildOnly: false,
	cooldown: 5,
	args: true,
	execute(message, args) {
    let search = args.join(' '); 
    search = search.trim();
    let options = {
      "useragent": "Whisker",
      "no_redirects": "1",
      "no_html": "0",
    }
    let description = "There is no description for this search term.";
    let heading = 'Search for "'+search+'":';
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
          icon_url: 'https://hazycora.com/whisker/assets/iconMath.png',
        },
        description: description,
        thumbnail: {
          url: thumbnail,
        },
//         fields: [
//           {
//             name: 'Websites',
//             value: 'Websites that may be relevent to your search:',
//           },
//           {
//             name: 'No websites',
//             value: 'There are no websites for this search.',
//           },
//         ],
        footer: {
          text: bottom,
        },
      };
      message.channel.send({ embed: searchEmbed });
    });
	},
};
