/**
 * Discord Welcome bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
const { MessageEmbed, Permissions } = require("discord.js");
module.exports = {
    name: "ban",
    //aliases: [],
    //description: "Ban a user.",
    permissions: [Permissions.FLAGS.BAN_MEMBERS],
    bot_perms: [Permissions.FLAGS.BAN_MEMBERS],
    args: true,
    guildOnly: true,
    catchError: false,
    cooldown: 5,
    usage: "[@user] (reason)",
    category: "Moderation",
    async execute(message, args, guildDB, t) {
        const { userFromMention } = require("../../functions/get.js");
        let channel;
        if (args.length < 1) {
            return message.reply(
                "Please mention the user you want to ban and specify a ban reason (optional)."
            );
        }

        const user = userFromMention(args[0], message.client);
        if (!user) {
            return message.reply(
                "Please use a proper mention if you want to ban someone."
            );
        }
        const member = message.guild.members.cache.get(user.id);
        if (!member) {
            member = await message.guild.members.fetch(user.id);
            if (!member) return message.reply(t("errors:userNotFound"));
        }
        if (user.id === message.client.user.id)
            return message.reply(
                "Please don't try to ban me, you have to do it yourself."
            );

        if (
            member.roles.highest.position >=
            message.member.roles.highest.position
        )
            return message.channel.send(
                "You cannot ban someone with an equal or higher role!"
            );

        const reason = args.slice(1).join(" ") || "Not specified";
        try {
            await message.guild.members.ban(user, { reason });
        } catch (err) {
            console.error(err);
            return message.channel.send(`Failed to ban **${user.tag}**`);
        }

        if (guildDB.modChannel) {
            channel = message.guild.channels.cache.find(
                (ch) => ch.name === guildDB.modChannel
            );
            if (channel) {
                embed = new MessageEmbed();
                embed.setTitle(`User banned: ${user.tag} (${user.id})`);
                embed.addField(
                    t("misc:resMod"),
                    `${message.author.tag} (${message.author.id})`
                );
                embed.addField("Reason:", reason);
                channel.send({ embeds: [embed] });
            }
        }

        message.reply(t("cmds:ban.success", {tag:user.tag}));
    },
};
