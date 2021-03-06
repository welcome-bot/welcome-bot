/**
 * Discord Welcome bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
const getGuild = require("../db/functions/guild/getGuild");
module.exports = async (member) => {
    let guildDB = await getGuild(member.guild.id);
    if (!guildDB.enableGoodbye) return;
    let channel = member.guild.channels.cache.find(
        (ch) => ch.name === guildDB.channel
    );
    if (!channel) {
        return;
    }
    channel.sendTyping();
    let msg = guildDB.goodByeMessage;
    //Replace Placeholders with their values
    msg = msg
        .replace("{mention}", `${member}`)
        .replace("{server}", `${member.guild.name}`)
        .replace("{members}", `${member.guild.memberCount}`);
    channel.send(msg);
};
