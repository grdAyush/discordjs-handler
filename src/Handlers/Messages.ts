import CustomClient from "../index";
import { readdirSync } from "fs";
import { join } from "path"; // Import path module to handle file paths

module.exports = async (client: CustomClient) => {
    readdirSync(join(__dirname, "../Commands/Message")).forEach((folder) => {
        const commandFiles = readdirSync(join(__dirname, `../Commands/Message/${folder}`)).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

        for (const file of commandFiles) {
            const command = require(`../Commands/Message/${folder}/${file}`);
            if (command.name) {
                client.MsgCmds.set(command.name, command);
            } else {
                continue;
            }

            if (command.aliases && Array.isArray(command.aliases)) {
                command.aliases.forEach((alias: string) => {
                    client.aliases.set(alias, command.name);
                });
            }
        }
    });
};
