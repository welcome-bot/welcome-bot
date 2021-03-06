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
                name: "lib",
                aliases: ["library"],
                memberPerms: [],
                botPerms: [],
                disabled: false,
                cooldown: 10,
                category: "Core",
            },
            client
        );
    }

    execute({ message, args }, t) {
        //TODO: Add translation
        let embed = new Embed().addField(
            "Discord.js v13 (master branch)",
            "We are opensource, you can check out source code at [GitHub](https://github.com/Welcome-Bot/welcome-bot)"
        );
        return message.reply({ embeds: [embed] });
    }
};
