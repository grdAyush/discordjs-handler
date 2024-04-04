import { Message, TextChannel, NewsChannel } from "discord.js";
import  CustomClient  from "../../index";
interface Config {
    Prefix: string;
    OwnerID: string;
    maintaince: boolean;
  }
  import { ChannelType, Collection, PermissionFlagsBits, EmbedBuilder } from "discord.js";
  
  const { Prefix , OwnerID, maintaince}: Config = require("../../../Configs/Config.json"); 
  const cooldowns: Map<string, Map<string, number>> = new Map();   
module.exports = {
    name: "messageCreate",
    once: false,

    async execute(message: Message, client: CustomClient) {
    let prefix = Prefix;


        if (message.author.bot) return;
        if (message.channel.type === ChannelType.DM){
            return message.channel.send("I am not allowed to respond to DMs");   
        }

        if (message.content.startsWith(prefix) || message.content.startsWith(`<@${client.user?.id}>`)) {


            if (message.content.startsWith(prefix)) {
                prefix = prefix;
            } else {
                prefix = `<@${client.user?.id}>`;
            }

            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const command = args.shift()?.toLowerCase();
            if(!command || command.length === 0) return;
            const cmd = client.MsgCmds.get(command) || client.MsgCmds.get(client.aliases.get(command));
           if (cmd) {
            
            const now = Date.now();
                const timestamps = cooldowns.get(command) || new Map<string, number>();
                const cooldownAmount = (cmd.options?.cooldown || 3) * 1000; 

                if (timestamps.has(message.author.id)) {
                    const expirationTime = (timestamps.get(message.author.id) || 0) + cooldownAmount;


                    if (now < expirationTime) {
                        const timeLeft = (expirationTime - now) / 1000;
                        return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command}\` command.`);
                    }
                }

                timestamps.set(message.author.id, now);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
                cooldowns.set(command, timestamps);
  
            if(!message.channel.permissionsFor(message.guild?.members.me || "")?.has(PermissionFlagsBits.SendMessages)) {

                return message.author.send({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle("Error").setColor("DarkRed")
                        .setDescription(`I do not have permission to send messages in that channel ( <#${message.channel.id}> )`)
                    ]
                }).catch(() => {});

                
    

            }

            if(!message.channel.permissionsFor(message.guild?.members.me || "")?.has(PermissionFlagsBits.EmbedLinks)) {

                return message.channel.send({
                    content: "I do not have permission to send embeds in this channel",
                }).catch(() => {});


           }

           if(!message.channel.permissionsFor(message.guild?.members.me || "")?.has(PermissionFlagsBits.UseExternalEmojis)) {

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Error").setColor("DarkRed")
                    .setDescription(`I do not have permission to use external emojis in this channel`)
                ]
            }).catch(() => {});


       }

       if(cmd.options?.BotPerms) {
              if(!message.guild?.members.me?.permissions.has(cmd.options.BotPerms)) {
                return message.channel.send({
                     embeds: [
                          new EmbedBuilder()
                          .setTitle("Error").setColor("DarkRed")
                          .setDescription(`I do not have the required permissions to run this command`)
                     ]
                }).catch(() => {});
              }
       }

         if(cmd.options?.UserPerms) {
          if(!message.member?.permissions.has(cmd.options.UserPerms)) {
             return message.channel.send({
                embeds: [
                      new EmbedBuilder()
                      .setTitle("Error").setColor("DarkRed")
                      .setDescription(`You do not have the required permissions to run this command`)
                ]
             }).catch(() => {});
          }}

          if(cmd.options?.OwnerOnly) {
                if(message.author.id !== OwnerID) {
                    return message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle("Error").setColor("DarkRed")
                            .setDescription(`This command is only available to the bot owner`)
                        ]
                    }).catch(() => {});
                }
          }

            if(cmd.options?.Voice) {
                if(!message.member?.voice.channelId) {
                    return message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle("Error").setColor("DarkRed")
                            .setDescription(`You must be in a voice channel to use this command`)
                        ]
                    }).catch(() => {});
                }
            }


            if (cmd.options?.Nsfw) {
                if (message.channel.isTextBased() && (message.channel as TextChannel | NewsChannel).nsfw == false) {
                    return message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Error").setColor("DarkRed")
                                .setDescription(`This command is only available in NSFW channels`)
                        ]
                    }).catch(() => {});
                }
            }

            if(cmd.options?.maintanance) {
               if(message.author.id !== OwnerID) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle("Error").setColor("DarkRed")
                        .setDescription(`This command is currently under maintanance`)
                    ]
                }).catch(() => {});
               }
            }            
        }

        if(maintaince) {
            if(message.author.id !== OwnerID) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle("Error").setColor("DarkRed")
                        .setDescription(`The bot is currently under maintaince`)
                    ]
                }).catch(() => {});
            }
        }

        try {
            cmd.execute(message, args, client);
        } catch (error) {
            console.error(error);
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Error").setColor("DarkRed")
                        .setDescription(`An error occured while running this command`)
                ]
            }).catch(() => {});
        }
        
    }
}}