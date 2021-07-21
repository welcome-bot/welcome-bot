/**
 * Discord Welcome-Bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
const getUser = require("../../db/functions/user/getUser");
const updateUser = require("../../db/functions/user/updateUser");
const { userFromMention } = require("../../helpers/Util.js");
const { Embed, Command } = require("../../classes");
module.exports = class CMD extends Command {
    constructor(client) {
        super(
            {
                name: "give",
                aliases: ["donate", "share"],
                memberPerms: [],
                botPerms: [],
                requirements: {
                    args: true,
                },
                usage: "[@mention / user id] [amount]",
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
        }

        if (!user || user.bot) {
            message.reply(t("errors:invalidUser"));
            return false;
        }
        if (user.id === message.author.id) {
            message.reply(t("cmds:give.errorYourself"));
            return false;
        }
        const amount = parseInt(args[1]);
        if (isNaN(amount)) {
            return message.reply(t("errors:invalidNumber"));
        }
        if (parseInt(userDB.wallet) - amount < 0) {
            return message.reply(t("cmds:deposit.notAvailable"));
        }
        let userDB2;
        try {
            userDB2 = await getUser(user.id);
        } catch (e) {
            return message.reply(t("errors:noAcc"));
        }
        if (typeof userDB2.bankLimit !== "number") {
            return message.reply(t("errors:noAcc"));
        }
        try {
            await updateUser(
                message.author.id,
                "wallet",
                parseInt(userDB.wallet) - amount
            );
            await updateUser(
                user.id,
                "wallet",
                amount + parseInt(userDB2.wallet)
            );
        } catch (e) {
            message.client.logger.log(
                "Error occurred when donating wcoins",
                "error"
            );
            throw e;
        }
        const embed = new Embed({ color: "lightblue", timestamp: true })
            .setTitle(t("cmds:give.title", { user: user.username }))
            .setDesc(
                t("cmds:give.success", {
                    amount,
                    yourWallet: parseInt(userDB.wallet) - amount,
                    userWallet: amount + parseInt(userDB2.wallet),
                    mention: `${message.author}`,
                    user: user.tag,
                })
            );
        message.reply({ embeds: [embed] });
    }
};
