/**
 * Discord Welcome bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
const { Embed, Command } = require("../../classes");
module.exports = class CMD extends Command {
    constructor(client) {
        super(
            {
                name: "ping",
                aliases: ["latency", "pong"],
                memberPerms: [],
                botPerms: [],
                disabled: false,
                cooldown: 5,
                category: "Core",
            },
            client
        );
    }

    execute({ message, args }, t) {
        //TODO: Add translation
        let msg = `Pong ${message.author}\nWebsocket heartbeat: ${message.client.ws.ping}ms.`;
        message.channel
            .send(msg + `\nGetting roundtrip latency`)
            .then((sent) => {
                sent.edit(
                    msg +
                        `\nRoundtrip latency: ${
                            sent.createdTimestamp - message.createdTimestamp
                        }ms`
                );
            });
    }
};
