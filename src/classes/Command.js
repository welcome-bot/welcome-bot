/**
 * Discord Welcome bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
const createOptionHandler = require("../functions/createOptionHandler");
const { Permissions, Collection } = require("discord.js");
module.exports = class Command {
    constructor(opts, client) {
        this.client = client;
        const options = createOptionHandler("Command", opts);
        this.name = options.required("name");
        this.aliases = options.optional("aliases", null);
        this.memberPerms = options.optional("memberPerms", null);
        this.botPerms = options.optional("botPerms", null);
        this.requirements = options.optional("requirements", {
            args: false,
            subcommand: false,
            guildOnly: false,
            ownerOnly: false,
        });
        this.usage = options.optional("usage", null);
        this.disabled = options.optional("disabled", false);
        this.subcommands = options.optional("subcommands", false);
        this.cooldown = options.optional("cooldown", 3);
        this.category = options.optional("category", "General");
        if (this.subcommands) {
            for (var i = 0; i < this.subcommands.length; i++) {
                if (this.subcommands[i].name && !this.subcommands[i].desc) {
                    throw new TypeError(
                        "If subcommands are provided then their description should also be provided\nDescription not provided for " +
                            this.subcommands[i].name
                    );
                    process.exit();
                }
            }
        }
        if (this.name.includes("-")) {
            this.aliases.push(this.name.replace(/-/g, ""));
        }
        if (this.aliases) {
            for (let i = 0; i < this.aliases.length; i++) {
                const alias = this.aliases[i];
                if (alias.includes("-")) {
                    const alias2 = alias.replace(/-/g, "");
                    if (this.name !== alias2) this.aliases.push(alias2);
                }
            }
        }
    }

    prerun(message, t) {
        const basicPerms = [
            Permissions.FLAGS.VIEW_CHANNEL,
            Permissions.FLAGS.SEND_MESSAGES,
            Permissions.FLAGS.READ_MESSAGE_HISTORY,
        ];
        if (message.channel.type !== "DM" && message.guild) {
            const bot_perms = message.guild.me.permissionsIn(message.channel);

            if (!bot_perms) {
                return message.reply(
                    `You didn't give the bot permission(s) to do this!\nSend \`${guildDB.prefix}help ${command.name}\` to get list of permissions required by this command.\nDon't know what you have given already? Send \`${guildDB.prefix}botperms\` in this channel itself.`
                );
            }
            for (var i = 0; i < basicPerms.length; i++) {
                if (!bot_perms.has(basicPerms[i])) {
                    return message.reply(
                        t("errors:iDontHavePermission", {
                            permission: t(
                                `permissions:${new Permissions(basicPerms[i])
                                    .toArray()
                                    .join("")
                                    .toUpperCase()}`
                            ),
                        })
                    );
                }
            }
        }
        const { cooldowns } = this.client.commands;

        if (!cooldowns.has(this.name)) {
            cooldowns.set(this.name, new Collection());
        }

        const now = Date.now(); //number of milliseconds elapsed since January 1, 1970 00:00:00 UTC. Example: 1625731103509
        const timestamps = cooldowns.get(this.name);
        const cooldownAmount = (this.cooldown || 3) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime =
                timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                //Still this cooldown didn't expire.
                const timeLeft = (expirationTime - now) / 1000;
                message.reply(
                    t(`errors:cooldown`, {
                        seconds: timeLeft.toFixed(1),
                        command: this.name,
                    })
                );
                return false;
            }
        }

        timestamps.set(message.author.id, now); //Set a timestamp for author with time now.
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); //Delete cooldown for author after cooldownAmount is over.
        return true;
    }
};
