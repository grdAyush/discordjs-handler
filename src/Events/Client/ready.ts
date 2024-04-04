import chalk from "chalk";
import  CustomClient  from "../../index";
import { ActivityType } from "discord.js";

module.exports = {
    name: "ready",
    once: false,

    async execute(client: CustomClient) {

        console.log(
            chalk.whiteBright("[") + chalk.greenBright("READY") + chalk.whiteBright("]") +
            chalk.whiteBright(" Logged in as ") + chalk.greenBright(`${client.user?.username}`) 
        )

        console.log(
            chalk.whiteBright("[") + chalk.greenBright("READY") + chalk.whiteBright("]") +
            chalk.whiteBright(" Bot is now ready to receive commands.")
        )

      
        console.log(
            chalk.whiteBright("[") + chalk.greenBright("READY") + chalk.whiteBright("]") +
            chalk.whiteBright(` Serving ${client.guilds.cache.size} Guilds.`)
        )

        console.log(
            chalk.whiteBright("[") + chalk.greenBright("READY") + chalk.whiteBright("]") +
            chalk.whiteBright(` Serving ${client.users.cache.size} Users.`)
        )

        console.log(
            chalk.whiteBright("[") + chalk.greenBright("READY") + chalk.whiteBright("]") +
            chalk.whiteBright(` Serving ${client.channels.cache.size} Channels.`)
        )


        client.user?.setActivity("with discord.js", { type: ActivityType.Competing });
       
    }
}