/**
 * Discord Welcome bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
const { Permissions } = require("discord.js");
const { Embed, Command } = require("../../classes");
module.exports = class CMD extends Command {
    constructor(client) {
        super(
            {
                name: "prune",
                aliases: ["purge"],
                memberPerms: [Permissions.FLAGS.KICK_MEMBERS],
                botPerms: [Permissions.FLAGS.KICK_MEMBERS],
                requirements: {
                    args: true,
                    guildOnly: true,
                },
                usage: "[no of msg / subcommand]",
                subcommands: [
                    { name: "all", desc: "Delete 100 messages" },
                    {
                        name: "bots",
                        desc: "Delete all messages sent by a bot in this channel",
                    },
                    {
                        name: "*[string]",
                        desc: '`*Text` will delete any message containing "Text"',
                    },
                ],
                disabled: false,
                cooldown: 10,
                category: "Moderation",
            },
            client
        );
    }

    execute({ message, args, guildDB }, t) {
        let messages;
        const errMsg =
            "An error occurred when trying to prune messages in this channel";
        switch (args[0]) {
            case "all":
                args[0] = 99;
                break;
            case "bots":
                messages = message.channel.messages.cache.filter(
                    (m) => m.author.bot
                );
                break;
        }
        if (typeof args[0] === "string" && args[0].startsWith("*")) {
            args[0] = args[0].slice(1); //Remove * from it
            messages = message.channel.messages.cache.filter(
                (m) => m.content.indexOf(args[0]) !== -1
            );
        }
        if (!isNaN(parseInt(args[0]))) {
            const amount = parseInt(args[0]) + 1;
            if (isNaN(amount)) {
                return message.reply(
                    "The provided number of messages to delete doesn't seem to be a valid number."
                );
            } else if (amount < 1 || amount > 100) {
                return message.reply(
                    t("errors:invalidNumRange", {
                        min: 1,
                        max: 100,
                    })
                );
            }

            message.channel.bulkDelete(amount, true).catch((err) => {
                message.client.logger.log(err, "error", ["PRUNING"]);
                return message.channel.send(errMsg);
            });
        } else {
            if (messages) {
                message.delete();
                message.channel.bulkDelete(messages, true).catch((err) => {
                    message.client.logger.log(err, "error", ["PRUNING"]);
                    return message.channel.send(errMsg);
                });
            } else {
                return message.channel.send(errMsg);
            }
        }
        message.channel
            .send("Pruning done 👍. This message will be deleted in 5 seconds")
            .then((msg) => {
                setTimeout(() => {
                    msg.delete();
                }, 5000);
            });
    }
};
