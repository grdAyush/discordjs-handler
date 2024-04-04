import ms from "ms";
import CustomClient from "../../index";
import { Interaction, PermissionFlagsBits, EmbedBuilder, TextChannel, NewsChannel } from "discord.js";
const cooldowns: Map<string, Map<string, number>> = new Map();
interface Config {
    OwnerID: string;
    maintanance: boolean;
  }

  const {  OwnerID, maintanance}: Config = require("../../../Configs/Config.json");  


module.exports = {
    name: "interactionCreate",
    once: false,

    async execute(interaction: Interaction, client: CustomClient) {

           if(interaction.isChatInputCommand()) {
                    let subCommandName = "";
                    try {
                        subCommandName = interaction.options.getSubcommand();
                    } catch { };
                    let subCommandGroupName = "";
                    try {
                        subCommandGroupName = interaction.options?.getSubcommandGroup() ?? "";
                    } catch { };

                    const command = client.ApplicationCmds.find(command => {
                        switch (command.name.length) {
                          case 1: return command.name[0] == interaction.commandName;
                          case 2: return command.name[0] == interaction.commandName && command.name[1] == subCommandName;
                          case 3: return command.name[0] == interaction.commandName && command.name[1] == subCommandGroupName && command.name[2] == subCommandName;
                        }
                      });
                      if (!command) return;

                    
                      const now = Date.now();

                      const timestamps = cooldowns.get(command.name[0]) || new Map<string, number>();
                      const cooldownAmount = (command.settings?.cooldown * 1000) || ms('5s'); 
          
                      if (timestamps.has(interaction.user.id)) {
                          const expirationTime = (timestamps.get(interaction.user.id) || 0) + cooldownAmount;
          
                          if (now < expirationTime) {
                              const timeLeft = (expirationTime - now) / 1000;
                              return interaction.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name[0]}\` command.`);
                          }
                      }
          
                      timestamps.set(interaction.user.id, now);
                      setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
                      cooldowns.set(command.name[0], timestamps);
                      if(!interaction.guild?.members.me?.permissions.has(PermissionFlagsBits.SendMessages)) {
                        interaction.user.dmChannel?.send("I don't have permission to send messages in that channel.");
                      }

                      if(!interaction.guild?.members.me?.permissions.has(PermissionFlagsBits.EmbedLinks)) {
                        interaction.channel?.send("I don't have permission to send embeds in this channel.");
                      }

                      if(!interaction.guild?.members.me?.permissions.has(PermissionFlagsBits.UseExternalEmojis)) {
                        interaction.channel?.send("I don't have permission to use External in this channel.");
                      }

                      if(command.settings?.BotPerms) {
                        if(!interaction.guild?.members.me?.permissions.has(command.settings.BotPerms)) {
                          return interaction.channel?.send({
                               embeds: [
                                    new EmbedBuilder()
                                    .setTitle("Error").setColor("DarkRed")
                                    .setDescription(`I do not have the required permissions to run this command`)
                               ]
                          }).catch(() => {});
                        }
                 }
          
                 if(command.settings?.UserPerms) {
                    if(typeof interaction.member?.permissions !== 'string' && !interaction.member?.permissions.has(command.settings.UserPerms)) {
                        return interaction.channel?.send({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle("Error").setColor("DarkRed")
                                .setDescription(`You do not have the required permissions to run this command`)
                            ]
                        }).catch(() => {});
                    }
                }
          
                    if(command.settings?.OwnerOnly) {
                          if(interaction.user.id !== OwnerID) {
                              return interaction.channel?.send({
                                  embeds: [
                                      new EmbedBuilder()
                                      .setTitle("Error").setColor("DarkRed")
                                      .setDescription(`This command is only available to the bot owner`)
                                  ]
                              }).catch(() => {});
                          }
                    }
          if(command.settings?.Voice)
 {                   if(interaction.member && 'voice' in interaction.member && !interaction.member.voice.channelId) {
                        return interaction.channel?.send({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle("Error").setColor("DarkRed")
                                .setDescription(`You must be in a voice channel to use this command`)
                            ]
                        }).catch(() => {});
                    }}
                    
          
                      if (command.settings?.Nsfw) {
                          if (interaction.channel?.isTextBased() && (interaction.channel as TextChannel | NewsChannel).nsfw == false) {
                              return interaction.channel.send({
                                  embeds: [
                                      new EmbedBuilder()
                                          .setTitle("Error").setColor("DarkRed")
                                          .setDescription(`This command is only available in NSFW channels`)
                                  ]
                              }).catch(() => {});
                          }
                      }
          
                      if(command.settings.maintanance) {
                         if(interaction.user.id !== OwnerID) {
                          return interaction.channel?.send({
                              embeds: [
                                  new EmbedBuilder()
                                  .setTitle("Error").setColor("DarkRed")
                                  .setDescription(`This command is currently under maintanance`)
                              ]
                          }).catch(() => {});
                         }
                      }      
                      
                      if(maintanance) {
                        if(interaction.user.id !== OwnerID) {
                            return interaction.channel?.send({
                                embeds: [
                                    new EmbedBuilder()
                                    .setTitle("Error").setColor("DarkRed")
                                    .setDescription(`The bot is currently under maintanance`)
                                ]
                            }).catch(() => {});
                        }
                    }


                    try {
                        command.run(interaction, client)
                    } catch (error) {
                        interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("Error").setColor("DarkRed")
                                    .setDescription(`An error occured while running this command`)
                            ],
                            ephemeral
                            : true
                        }).catch(() => {
                        })
                    }

         
          

}

if(interaction.isContextMenuCommand()) {
    const command = client.ApplicationCmds.find(command => command.name[0] == interaction.commandName);
    if (!command) return;
    const now = Date.now();

    const timestamps = cooldowns.get(command.name[0]) || new Map<string, number>();
    const cooldownAmount = (command.settings?.cooldown * 1000) || ms('5s'); 

    if (timestamps.has(interaction.user.id)) {
        const expirationTime = (timestamps.get(interaction.user.id) || 0) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return interaction.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name[0]}\` command.`);
        }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
    cooldowns.set(command.name[0], timestamps);
    if(!interaction.guild?.members.me?.permissions.has(PermissionFlagsBits.SendMessages)) {
        interaction.user.dmChannel?.send("I don't have permission to send messages in that channel.");
    }

    if(!interaction.guild?.members.me?.permissions.has(PermissionFlagsBits.EmbedLinks)) {
        interaction.channel?.send("I don't have permission to send embeds in this channel.");
    }

    if(!interaction.guild?.members.me?.permissions.has(PermissionFlagsBits.UseExternalEmojis)) {
        interaction.channel?.send("I don't have permission to use External in this channel.");
    }

    if(command.settings?.BotPerms) {
      if(!interaction.guild?.members.me?.permissions.has(command.settings.BotPerms)) {
        return interaction.channel?.send({
             embeds: [
                  new EmbedBuilder()
                  .setTitle("Error").setColor("DarkRed")
                  .setDescription(`I do not have the required permissions to run this command`)
             ]
        }).catch(() => {});
      }
  }



    if(command.options?.UserPerms) {
        if(typeof interaction.member?.permissions !== 'string' && !interaction.member?.permissions.has(command.options.UserPerms)) {
            return interaction.channel?.send({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Error").setColor("DarkRed")
                    .setDescription(`You do not have the required permissions to run this command`)
                ]
            }).catch(() => {});
        }
    
    }

    if(command.settings?.OwnerOnly) {
        if(interaction.user.id !== OwnerID) {
            return interaction.channel?.send({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Error").setColor("DarkRed")
                    .setDescription(`This command is only available to the bot owner`)
                ]
            }).catch(() => {});
        }
    }

    if(interaction.member && 'voice' in interaction.member && !interaction.member.voice.channelId) {
        return interaction.channel?.send({
            embeds: [
                new EmbedBuilder()
                .setTitle("Error").setColor("DarkRed")
                .setDescription(`You must be in a voice channel to use this command`)
            ]
        }).catch(() => {});
    }

    if(command.settings?.SameVoice) {
        if( interaction.member && 'voice' in interaction.member && interaction.guild?.members.me?.voice.channelId !== interaction.member.voice.channelId) {
            return interaction.channel?.send({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Error").setColor("DarkRed")
                    .setDescription(`You must be in the same voice channel as me to use this command`)
                ]
            }).catch(() => {});
        }
    }

    if (command.settings?.Nsfw) {
        if (interaction.channel?.isTextBased() && (interaction.channel as TextChannel | NewsChannel).nsfw == false) {
            return interaction.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Error").setColor("DarkRed")
                        .setDescription(`This command is only available in NSFW channels`)
                ]
            }).catch(() => {});
        }
    }

    if(command.settings.maintanance) {
        if(interaction.user.id !== OwnerID) {
         return interaction.channel?.send({
             embeds: [
                 new EmbedBuilder()
                 .setTitle("Error").setColor("DarkRed")
                 .setDescription(`This command is currently under maintanance`)
             ]
         }).catch(() => {});
        }
     }      
     
     if(maintanance) {
       if(interaction.user.id !== OwnerID) {
           return interaction.channel?.send({
               embeds: [
                   new EmbedBuilder()
                   .setTitle("Error").setColor("DarkRed")
                   .setDescription(`The bot is currently under maintanance`)
               ]
           }).catch(() => {});
       }}

        try {
            command.run(interaction, client)
        } catch (error) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Error").setColor("DarkRed")
                        .setDescription(`An error occured while running this command`)
                ],
                ephemeral
                : true
            }).catch(() => {
            })

}




}
}}
