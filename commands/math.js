const mathsteps = require('mathsteps');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'search',
	description: 'Search for a topic',
	usage: 'search searchTerm',
	guildOnly: false,
	cooldown: 5,
	args: true,
	execute(message, args) {
    question = args.join(' '); 
    question = question.trim();
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
	},
};
