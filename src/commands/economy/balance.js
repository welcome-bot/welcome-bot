/**
 * Discord Welcome-Bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
const getUser = require("../../db/functions/user/getUser");
const { userFromMention } = require("../../helpers/Util.js");
const { Embed, Command } = require("../../classes");
module.exports = class CMD extends Command {
    constructor(client) {
        super(
            {
                name: "balance",
                aliases: ["bal", "wallet"],
                memberPerms: [],
                botPerms: [],
                disabled: false,
                cooldown: 5,
                category: "Economy",
            },
            client
        );
    }

    async execute({ message, args, guildDB, userDB }, t) {
        let user;
        if (args[0]) {
            if (args[0].startsWith("<@")) {
                user = userFromMention(
                    args[0] || `${message.author}`,
                    message.client
                );
            }
            if (
                !isNaN(parseInt(args[0])) &&
                args[0] !== message.client.user.id
            ) {
                user = message.client.users.cache.get(args[0]);
                if (!user) user = await message.client.users.fetch(args[0]);
            }
        } else {
            user = message.author;
        }

        if (!user || user.bot) {
            message.reply(t("errors:invalidUser"));
            return false;
        }
        let userDB2;
        try {
            userDB2 = await getUser(user.id);
        } catch (e) {
            return message.reply(t("errors:noAcc"));
        }
        const { wallet, bank, bankLimit } = userDB2;
        if (typeof bankLimit !== "number") {
            return message.reply(t("errors:noAcc"));
        }
        const embed = new Embed({ color: "lightblue", timestamp: true })
            .setTitle(t("cmds:balance.title", { user: user.username }))
            .setDesc(
                t("cmds:balance.bal", {
                    wallet,
                    bank,
                    bankLimit,
                    percentage: (bankLimit - bank) / 100,
                })
            );
        message.reply({ embeds: [embed] });
    }
};
