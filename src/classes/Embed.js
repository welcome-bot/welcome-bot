/**
 * Discord Welcome bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
const { MessageEmbed } = require("discord.js");
module.exports = class Embed extends MessageEmbed {
    constructor({ tag, avatarURL, color, timestamp, footer }, data = {}) {
        super(data);
        switch (color.toLowerCase()) {
            case "error":
            case "error":
                color = "#ff0000";
                break;
            case "success":
                color = "#33ddff";
                break;
            case "blue":
                color = "#0091fc";
                break;
            case "lightblue":
                color = "#76b3fc";
                break;
            default:
                if (!color) color = "RANDOM";
                break;
        }
        this.setColor(color);
        if (tag && avatarURL) this.setFooter(`${tag}`, `${avatarURL}`);
        else if (tag) this.setFooter(`${tag}`);
        else if (footer) this.setFooter(`${footer}`);
        if (timestamp) this.setTimestamp();
    }

    setDesc(description) {
        return this.setDescription(description);
    }
};
