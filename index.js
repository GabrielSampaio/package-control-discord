const Discord = require("discord.js");
// const config = require("./config.json");
const Keyv = require('keyv');


const client = new Discord.Client();
const keyv = new Keyv(); // for in-memory storage
const globalPrefix = '!';


keyv.on('error', err => console.error('Keyv connection error:', err));
(async () => {
	// true
  await keyv.set('partialStatus', "Livre");
  await keyv.set('partialUser', "Ninguém");
  await keyv.set('uatStatus', "Livre");
  await keyv.set('uatUser', "Ninguém");
})();

client.on('message', async message => {
	if (message.author.bot) return;

	let args;
	// handle messages in a guild
	if (message.guild) {
		let prefix;

		if (message.content.startsWith(globalPrefix)) {
			prefix = globalPrefix;
		} else {
		// 	// check the guild-level prefix
		// 	const guildPrefix = await prefixes.get(message.guild.id);
		// 	if (message.content.startsWith(guildPrefix)) prefix = guildPrefix;
    }
    // console.log(message.channel.id);
    if(message.channel.id != "774374303231246356")
      return;
		// if we found a prefix, setup args; otherwise, this isn't a command
		if (!prefix) return;
    args = message.content.slice(prefix.length).trim().split(/\s+/);
    
    	// get the first space-delimited argument after the prefix as the command
    const command = args.shift().toLowerCase();
    if(command === "limpar"){
      message.channel.messages.fetch({
        limit: 100,
       }).then((messages) => {
        messages = messages.filter(m => m.author.bot === true).array();
        message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
       });
    }else if (command === "help") {
      message.channel.send("**Comandos disponíveis:**").then(function(){
        message.channel.send("**!uat \`[usar/liberar]\`**-> Define status de uat");
        message.channel.send("**!partial \`[usar/liberar]\`**-> Define status de partial");
        message.channel.send("**!status \`[uat/partial]\`**-> Mostra o status do ambiete desejado. Se informado nenhum mostrará dos dois");
      });
    }else if (command === "partial") {
      if(args[0] === "liberar")
      {
        await keyv.set('partialStatus', "Livre");
        await keyv.set('partialUser', "Ninguém");
        message.reply(`Partial Liberado com sucesso!`).catch(console.error);
      }else if(args[0] === "usar"){
        if(await keyv.get('partialStatus') === "Ocupado")
        {
          message.reply(`Partial já em uso por <@${await keyv.get('partialUser')}>`).catch(console.error);
          return;
        } 
        await keyv.set('partialStatus', "Ocupado");
        await keyv.set('partialUser', message.author.id);
        message.reply(`Partial Ocupado com sucesso!`).catch(console.error);
      }else{
        message.reply(`Argumento invalido! Informe se pretende \`[usar ou liberar]\` o ambiente`).catch(console.error);
      }
  
    }
    else if (command === "uat") {
      if(args[0] === "liberar")
      {
        await keyv.set('uatStatus', "Livre");
        await keyv.set('uatUser', "Ninguém");
        message.reply(`UAT Liberado com sucesso!`).catch(console.error);
      }else if(args[0] === "usar"){
        if(await keyv.get('uatStatus') === "Ocupado")
        {
          message.reply(`UAT já em uso por <@${await keyv.get('uatUser')}>`).catch(console.error);
          return;
        } 
        await keyv.set('uatStatus', "Ocupado");
        await keyv.set('uatUser', message.author.id);
        message.reply(`UAT Ocupado com sucesso!`).catch(console.error);
      }else{
        message.reply(`Argumento invalido! Informe se pretende \`[usar ou liberar]\` o ambiente`).catch(console.error);
      }
    
    }  
    else if (command === "status") {
      
      if(args[0] === "uat" || args.length == 0)
      {
        const statusMessageUat = new Discord.MessageEmbed();
        statusMessageUat.setTitle('Status **UAT**')
        .setDescription('Status de subida de UAT')
        .addField('Status', await keyv.get('uatStatus'), true);
        if(await keyv.get('uatStatus') != "Livre")
        {
          statusMessageUat.addField('Responsável', await keyv.get('uatUser'), true)
          .setColor('#b30c00');
        }
        else{
          statusMessageUat.setColor('#00b341');
        }
        message.channel.send(statusMessageUat);
      }
      if (args[0] == "partial" || args.length == 0)
      {
        const statusMessagePartial = new Discord.MessageEmbed();
        statusMessagePartial.setTitle('Status **PARTIAL**')
        .setDescription('Status de subida de PARTIAL')
        .addField('Status', await keyv.get('partialStatus'), true);
        if(await keyv.get('partialStatus') != "Livre")
        {
          statusMessagePartial.addField('Responsável', await keyv.get('partialUser'), true)
          .setColor('#b30c00');
        }
        else{
          statusMessagePartial.setColor('#00b341');
        }
        return message.channel.send(statusMessagePartial);
      }
      if(args.length > 0 && args[0] != "uat" && args[0] != "partial")
        message.reply(`Argumento invalido! Informe se pretende \`[usar ou liberar]\` o ambiente`).catch(console.error);
    }
	} else {
		// handle DMs
		const slice = message.content.startsWith(globalPrefix) ? globalPrefix.length : 0;
		args = message.content.slice(slice).split(/\s+/);
  }
  


  
});

// bot.on('ready', () => {
//   setInterval(() => {
//       bot.user.setActivity(`UAT \`${await keyv.get('uatStatus')}\` | PATIAL \`${await keyv.get('partialStatus')}\``);
//   }, 20000); // Runs this every 10 seconds.
// });

client.login(ENV['BOT_TOKEN'])