import  CustomClient from "../index"
interface Config {
    ErrWebhook: string;
  }
const { ErrWebhook }: Config = require("../../Configs/Config.json");
import { WebhookClient, EmbedBuilder } from "discord.js";
import chalk from "chalk";
module.exports = async (client: CustomClient) => {

    const webhook = new WebhookClient({ url: ErrWebhook });

    process.on("unhandledRejection", (err, path) => {
        const embed = new EmbedBuilder()
            .setTitle("Unhandled Rejection")
            .setDescription(`\`\`\`js\n${err}\`\`\``)
            .setColor("NotQuiteBlack")
            .setTimestamp()
        webhook.send({ embeds: [embed] }).catch((err) => {
            console.log(chalk.bold.bgCyanBright("Cannot Send Message to Webhook") + chalk.redBright(err))
            console.log(path)
        });
        console.log( chalk.whiteBright("[") + chalk.redBright("ERROR") + chalk.whiteBright("]") + chalk.redBright(" Unhandled Rejection") + chalk.whiteBright(" | ") + chalk.bgRedBright(`${err}`))
        console.log(err)
    })


    process.on("uncaughtException", (err) => {
        const embed = new EmbedBuilder()
            .setTitle("Uncaught Exception")
            .setDescription(`\`\`\`js\n${err}\`\`\``)
            .setColor("NotQuiteBlack")
            .setTimestamp()
        webhook.send({ embeds: [embed] }).catch((err) => {
            console.log(chalk.bold.bgCyanBright("Cannot Send Message to Webhook") + chalk.redBright(err))
        });
        console.log( chalk.whiteBright("[") + chalk.redBright("ERROR") + chalk.whiteBright("]") + chalk.redBright(" Uncaught Exception") + chalk.whiteBright(" | ") + chalk.bgRedBright(`${err}`))
    })

    process.on("uncaughtExceptionMonitor", (err) => {
        const embed = new EmbedBuilder()
            .setTitle("Uncaught Exception Monitor")
            .setDescription(`\`\`\`js\n${err}\`\`\``)
            .setColor("NotQuiteBlack")
            .setTimestamp()
        webhook.send({ embeds: [embed] }).catch((err) => {
            console.log(chalk.bold.bgCyanBright("Cannot Send Message to Webhook") + chalk.redBright(err))
        });
        console.log( chalk.whiteBright("[") + chalk.redBright("ERROR") + chalk.whiteBright("]") + chalk.redBright(" Uncaught Exception Monitor") + chalk.whiteBright(" | ") + chalk.bgRedBright(`${err}`))
    })


    process.on("warning", (warning) => {
        const embed = new EmbedBuilder()
            .setTitle("Warning")
            .setDescription(`\`\`\`js\n${warning}\`\`\``)
            .setColor("NotQuiteBlack")
            .setTimestamp()
        webhook.send({ embeds: [embed] }).catch((err) => {
            console.log(chalk.bold.bgCyanBright("Cannot Send Message to Webhook") + chalk.redBright(err))
        });
        console.log( chalk.whiteBright("[") + chalk.redBright("ERROR") + chalk.whiteBright("]") + chalk.redBright(" Warning") + chalk.whiteBright(" | ") + chalk.bgRedBright(`${warning}`))
    })


}