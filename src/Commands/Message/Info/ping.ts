import  CustomClient  from "../../../index"
import { Message } from "discord.js";

module.exports = {
    name: "ping",
    description: "Ping Pong",
    options: {
        Nsfw: false,
        OwnerOnly: false,
        maintanance: false,
        UserPerms: [],
        BotPerms: [],
        cooldown: 5,
    },
    
    aliases: ["pp"],
    async execute (message: Message, args: string[], client: CustomClient) {

        message.reply("pong pong")

    }
}