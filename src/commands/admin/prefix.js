/**
 * Discord Welcome bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
module.exports = {
    name: "prefix",
    //aliases: [],
    description: "Manage perfix for this server, subcommands: set, get, reset",
    args: true,
    async execute(message, args) {
        const updateGuild = require("../../db/functions/updateGuild");
        const getGuild = require("../../db/functions/getGuild");
        let guildDB = await getGuild(message.guild.id);
        switch (args[0].toLowerCase()) {
            case "set":
                if (message.member.hasPermission("ADMINISTRATOR")) {
                    //Set bot prefix
                    updateGuild(
                        message.guild.id,
                        "prefix",
                        args.join(" ").replace(`${args[0]} `, "")
                    );
                    message.reply(
                        "Prefix set to '" +
                            args.join(" ").replace(`${args[0]} `, "") +
                            "' (without quotes)"
                    );
                } else {
                    message.reply(
                        "Sorry, You don't have ADMINISTRATOR permission"
                    );
                }
                break;
            case "get":
                //Get bot prefix
                message.reply(
                    "Prefix in this server is set to '" +
                        guildDB.prefix +
                        "' (without quotes)"
                );
                break;
            case "reset":
                //Reset bot prefix
                if (message.member.hasPermission("ADMINISTRATOR")) {
                    updateGuild(message.guild.id, "prefix", "!w ");
                    guildDB = await getGuild(message.guild.id);
                    message.reply(
                        "Prefix reset to '" +
                            guildDB.prefix +
                            "' (without quotes)"
                    );
                } else {
                    message.reply(
                        "Sorry, You don't have ADMINISTRATOR permission"
                    );
                }
                break;
            default:
                message.reply(
                    "Are you trying to run a subcommand?\nI think you have a typo in the subcommand."
                );
                break;
        }
    },
};
