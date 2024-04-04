import CustomClient from "../index";
import { readdirSync } from "fs";
import { join } from "path"; 

module.exports = async (client: CustomClient) => {
    const eventFolders = readdirSync(join(__dirname, "../Events"));

    for (const folder of eventFolders) {
        const eventFiles = readdirSync(join(__dirname, `../Events/${folder}`)).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

        for (const file of eventFiles) {
            const event = require(`../Events/${folder}/${file}`);
            client.events++;

            if (event.once) {
                client.once(event.name, (...args: any[]) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args: any[]) => event.execute(...args, client));
            }
        }
    }
}
