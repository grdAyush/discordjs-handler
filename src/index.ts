import { Client, GatewayIntentBits, Collection } from "discord.js";
import { readdirSync } from "fs";
interface Config {
  Token: string;
}

const { Token }: Config = require("../Configs/Config.json");
import chalk from "chalk";
import { PrismaClient } from "@prisma/client";
import { join } from "path"; 


class CustomClient extends Client {
  ApplicationCmds = new Collection<string, any>();
  MsgCmds = new Collection<string, any>();
  aliases = new Collection<string, any>();
  context = new Collection<string, any>();
  events = 0;
  color = "#FF0000";
  
}

const client = new CustomClient({
  intents: [
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
  allowedMentions: { parse: ["users", "roles"], repliedUser: true },
});

const HandlerFolders = readdirSync(join(__dirname, "Handlers")).filter((file) =>
  file.endsWith(".ts") || file.endsWith(".js")
);

for (const folder of HandlerFolders) {
  require(join(__dirname, "Handlers", folder))(client);
}

client.login(Token);

export default CustomClient;
async function Prisma() {
  const prisma = new PrismaClient();
try {
 
 await  prisma.$connect();
  console.log(chalk.whiteBright("[") + chalk.greenBright("DATABASE") + chalk.whiteBright("]") + chalk.greenBright(" Connection Has Been Established Prisma Is Ready To Use"));
} catch (error) {
await    prisma.$disconnect();
  console.error(chalk.whiteBright("[") + chalk.redBright("DATABASE") + chalk.whiteBright("]") + chalk.redBright(" Connection Has Been Failed"));
  console.error(error);

}}

Prisma().catch(console.error);