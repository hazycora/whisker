const mathsteps = require('mathsteps');
const { embedColor } = require('../config.json');

module.exports = {
	name: 'math',
	aliases: ['solve'],
	description: 'Answer simple math',
	usage: 'math 2x-2=6',
	guildOnly: false,
	cooldown: 5,
	args: true,
	execute(message, args) {
    let question = args.join(' '); 
    question = question.trim();
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
          icon_url: 'https://hazycora.com/whisker/assets/iconMath.png',
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
          icon_url: 'https://hazycora.com/whisker/assets/iconMath.png',
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
