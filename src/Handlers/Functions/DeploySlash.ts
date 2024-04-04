import { plsParseArgs } from 'plsargs';
import * as chillout from "chillout";
import { makeSureFolderExists } from "stuffs";
import * as path from "path";
import readdirRecursive from "recursive-readdir";
interface Config {
    Token: string;
  }

  interface User {
    username: string;
    discriminator: string;
    id: string;
  }
  
  const { Token }: Config = require("../../../Configs/Config.json");
import { REST, Routes, ApplicationCommandManager, ApplicationCommandOptionType } from 'discord.js';

async function deploySlashCommands(deployMode: 'guild' | 'global', guildId?: string): Promise<void> {
  try {
    const rest = new REST({ version: "10" }).setToken(Token);
    const client = await rest.get(Routes.user()) as User;
    console.info(`Account information received! ${client.username}#${client.discriminator} (${client.id})`);

    let command: any[] = [];
    let cleared = false;

    if (!cleared) {
      const interactionsFolder = path.resolve(__dirname, "../../Commands/Application");
      await makeSureFolderExists(interactionsFolder);
      const store: any[] = [];

      console.log("Reading interaction files..");

      let interactionFilePaths = await readdirRecursive(interactionsFolder);
      interactionFilePaths = interactionFilePaths.filter(i => !path.basename(i).startsWith("-"));

      await chillout.forEach(interactionFilePaths, async (interactionFilePath: string) => {
        const cmd = require(interactionFilePath);
        console.log(`Interaction "${cmd.type == "CHAT_INPUT" ? `/${cmd.name.join(" ")}` : `${cmd.name[0]}`}" ${cmd.name[1] || ""} ${cmd.name[2] || ""} added to the transform list!`);
        store.push(cmd);
      });

      store.sort((a, b) => a.name.length - b.name.length);

      command = store.reduce((all, current) => {
        switch (current.name.length) {
          case 1: {
            all.push({
              type: current.type,
              name: current.name[0],
              description: current.description,
              default_permission: current.defaultPermission,
              options: current.options
            });
            break;
          }
          case 2: {
            let baseItem = all.find((i: any) => i.name === current.name[0] && i.type === current.type);
            if (!baseItem) {
              all.push({
                type: current.type,
                name: current.name[0],
                description: `${current.name[0]} commands.`,
                default_permission: current.defaultPermission,
                options: [
                  {
                    type: ApplicationCommandOptionType.Subcommand,
                    description: current.description,
                    name: current.name[1],
                    options: current.options
                  }
                ]
              });
            } else {
              baseItem.options.push({
                type: ApplicationCommandOptionType.Subcommand,
                description: current.description,
                name: current.name[1],
                options: current.options
              });
            }
            break;
          }
          case 3: {
            let SubItem = all.find((i: any) => i.name === current.name[0] && i.type === current.type);
            if (!SubItem) {
              all.push({
                type: current.type,
                name: current.name[0],
                description: `${current.name[0]} commands.`,
                default_permission: current.defaultPermission,
                options: [
                  {
                    type: ApplicationCommandOptionType.SubcommandGroup,
                    description: `${current.name[1]} commands.`,
                    name: current.name[1],
                    options: [
                      {
                        type: ApplicationCommandOptionType.Subcommand,
                        description: current.description,
                        name: current.name[2],
                        options: current.options
                      }
                    ]
                  }
                ]
              });
            } else {
              let GroupItem = SubItem.options.find((i: any) => i.name === current.name[1] && i.type === ApplicationCommandOptionType.SubcommandGroup);
              if (!GroupItem) {
                SubItem.options.push({
                  type: ApplicationCommandOptionType.SubcommandGroup,
                  description: `${current.name[1]} commands.`,
                  name: current.name[1],
                  options: [
                    {
                      type: ApplicationCommandOptionType.Subcommand,
                      description: current.description,
                      name: current.name[2],
                      options: current.options
                    }
                  ]
                });
              } else {
                GroupItem.options.push({
                  type: ApplicationCommandOptionType.Subcommand,
                  description: current.description,
                  name: current.name[2],
                  options: current.options
                });
              }
            }
            break;
          }
        }
        return all;
      }, []);
    } else {
      console.info("No interactions read, all existing ones will be cleared...");
    }

    console.info(`Interactions are posted on Discord!`);

    switch (deployMode) {
      case "guild": {
        if (!guildId) {
          console.error("Guild ID is required for guild deployment.");
          return;
        }
        console.info(`Deploy mode: guild (${guildId})`);
        await rest.put(Routes.applicationGuildCommands(client.id, guildId), { body: command });
        console.info(`Shared commands may take 3-5 seconds to arrive.`);
        break;
      }
      case "global": {
        console.info(`Deploy mode: global`);
        await rest.put(Routes.applicationCommands(client.id), { body: command });
        console.info(`Shared commands can take up to 1 hour to arrive. If you want it to come immediately, you can remove your bot from your server and add it back.`);
        break;
      }
      default:
        console.error(`Invalid deployment mode: ${deployMode}`);
        return;
    }

    console.info(`Interactions shared!`);
  } catch (error) {
    console.error("Error deploying slash commands:", error);
  }
}

export default deploySlashCommands;