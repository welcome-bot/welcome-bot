/**
 * Discord Welcome bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
module.exports = {
    name: "channel",
    aliases: ["chan"],
    description:
        "Manage channel for this server\nNot providing any arguments will display the current settings.",
    permissions: ["MANAGE_SERVER"],
    subcommand: false,
    subcommands: ["set", "get", "reset"],
    async execute(message, args) {
        const updateGuild = require("../../db/functions/updateGuild");
        const getGuild = require("../../db/functions/getGuild");
        let guildDB = await getGuild(message.guild.id);
        let subcommand;
        if (args[0]) {
            subcommand = args[0].toLowerCase();
        } else {
            subcommand = "";
        }
        switch (subcommand) {
            case "set":
                if (args[1]) {
                    //Set channel
                    updateGuild(
                        message.guild.id,
                        "channel",
                        args
                            .join(" ")
                            .replace(`${args[0]} `, "")
                            .replace(" ", "")
                    ); //replace(" ", "") to replace empty space, there is no empty space in a channel name
                    message.reply(
                        "Channel set to '" +
                            args
                                .join(" ")
                                .replace(`${args[0]} `, "")
                                .replace(" ", "") +
                            "' (without quotes)"
                    );
                } else {
                    message.reply(
                        "Please supply valid value for setting channel."
                    );
                }
                break;
            case "reset":
                //Reset channel
                updateGuild(message.guild.id, "channel", "new-members");
                guildDB = await getGuild(message.guild.id);
                message.reply(
                    "Channel reset to '" +
                        guildDB.channel +
                        "' (without quotes)"
                );
                break;
            case "get":
            default:
                //Get channel
                message.reply(
                    "Channel currently is set to '" +
                        guildDB.channel +
                        "' (without quotes)"
                );
                break;
        }
    },
};
