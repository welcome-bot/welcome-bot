/**
 * Discord Welcome-Bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    bank: {
        type: Number,
        trim: true,
        required: true,
        default: 25,
    },
    wallet: {
        type: Number,
        trim: true,
        required: true,
        default: 25,
    },
    bankLimit: {
        type: Number,
        trim: true,
        required: true,
        default: 10000, //10k
    },
    dailyClaimed: {
        type: Number,
        trim: true,
        required: true,
        default: 0,
    },
    registeredAt: {
        type: Number,
        default: Date.now(),
    },
    bio: {
        type: String,
        default: "404 No bio set :-(",
    },
    logged: {
         type: Boolean,
         default: false
    },
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
