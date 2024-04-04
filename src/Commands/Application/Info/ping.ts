import  CustomClient  from "../../../index"
import { CommandInteraction, ApplicationCommandType } from "discord.js";

module.exports = {
    name: ["ping"],
    type: ApplicationCommandType.ChatInput,
    description: "Ping Pong",
    settings: {
        Nsfw: false,
        OwnerOnly: false,
        maintanance: false,
        UserPerms: [],
        BotPerms: [],
        Voice: false,
        cooldown: 5,
    },
  
    run: async (interaction: CommandInteraction, client: CustomClient) => {

        interaction.reply("pong pong")
    }
}