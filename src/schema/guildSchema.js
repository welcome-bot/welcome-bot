/**
 * Discord Welcome bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    prefix: {
        type: String,
        required: true,
        trim: true,
        default: "w/",
    },
    channel: {
        type: String,
        required: true,
        trim: true,
        default: "new-members",
    },
    welcomeMessage: {
        type: String,
        required: true,
        trim: true,
        default:
            "Welcome {mention} to the {server} server!\nYou are our #{members} member",
    },
    goodByeMessage: {
        type: String,
        required: true,
        trim: true,
        default: "Good Bye {mention}!\nWe are sad to see you go!",
    },
    modChannel: {
        type: String,
        required: true,
        trim: true,
        default: "mod-log",
    },
    enableWelcome: {
        type: Boolean,
        default: true,
    },
    enableGoodbye: {
        type: Boolean,
        default: true,
    },
    lang: {
        type: String,
        required: true,
        trim: true,
        default: "en-US",
    },
});

const Guild = new mongoose.model("Guild", guildSchema);

module.exports = Guild;
