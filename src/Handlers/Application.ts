import CustomClient from "../index";
import chalk from "chalk";

import readdirRecursive from "recursive-readdir"
import { resolve, relative } from "path"
import * as chillout from "chillout"
import deploySlashCommands from "./Functions/DeploySlash"
interface Config {
    SlashGlobal: boolean;
    GuildID: string;
  }
 
  const { SlashGlobal, GuildID  }: Config = require("../../Configs/Config.json");
  
module.exports = async (client: CustomClient) => {
    let CmdsPath = resolve(__dirname, "../Commands/Application")
    let Cmds = await readdirRecursive(CmdsPath);

    await chillout.forEach(Cmds, async (file: string) => {
        const st = Date.now();
        const relativePath = relative(CmdsPath, file);
        const command = require(file);


        if(command.name.lenght > 3) {
            console.log(chalk.whiteBright("[") + chalk.redBright("WARNING") + chalk.whiteBright("]") + chalk.redBright(` ${relativePath} The name list of the interaction file is too long. (<_>) Skipping..`))

            return;
        }

        if(!command.name?.length) {
            console.log(chalk.whiteBright("[") + chalk.redBright("WARNING") + chalk.whiteBright("]") + chalk.redBright(` ${relativePath} The interaction file does not have a name. Skipping..`))

            return;
        }

        if(client.ApplicationCmds.has(command.name)) {
            console.log(chalk.whiteBright("[") + chalk.redBright("WARNING") + chalk.whiteBright("]") + chalk.redBright(` ${relativePath} The interaction name is already in use. Skipping..`))

            return;
        }

        client.ApplicationCmds.set(command.name, command);

        console.log(chalk.whiteBright("[") + chalk.greenBright("INFO") + chalk.whiteBright("]") + chalk.greenBright(` ${relativePath} Loaded in ${Date.now() - st}ms`))

       
    })

    if(client.ApplicationCmds.size) {
        console.log(chalk.whiteBright("[") + chalk.greenBright("INFO") + chalk.whiteBright("]") + chalk.greenBright(` ${client.ApplicationCmds.size} Application Commands Loaded`))
    } else {
        console.log(chalk.whiteBright("[") + chalk.redBright("WARNING") + chalk.whiteBright("]") + chalk.redBright(` No Application Has Been Commands Loaded, Hmm I think You Forgot To Create A Command 🙂.`))
    }

    try {
        if (SlashGlobal) {
             deploySlashCommands("global");
        } else {
             deploySlashCommands("guild", GuildID);
        }
    } catch (error) {
        console.log(chalk.whiteBright("[") + chalk.redBright("ERROR") + chalk.whiteBright("]") + chalk.redBright(` ${error}`))
    }


}