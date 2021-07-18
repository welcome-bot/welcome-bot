/**
 * Discord Welcome bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
const userFromMention = function (mention, client) {
    // The id is the first and only match found by the RegEx.
    const matches = mention.match(/^<@!?(\d+)>$/);

    // If supplied variable was not a mention, matches will be null instead of an array.
    if (!matches) return;

    // However, the first element in the matches array will be the entire mention, not just the ID,
    // so use index 1.
    const id = matches[1];

    return client.users.cache.get(id);
};

const channelIdFromMention = function (mention) {
    // The id is the first and only match found by the RegEx.
    const matches = mention.match(/^<#!?(\d+)>$/);

    // If supplied variable was not a mention, matches will be null instead of an array.
    if (!matches) return;

    // However, the first element in the matches array will be the entire mention, not just the ID,
    // so use index 1.
    return matches[1];
};

const lowercaseKeys = (obj) => {
    Object.keys(obj).reduce((acc, key) => {
        obj[key.toLowerCase()] = obj[key];
    });
    return obj;
};

const lowercaseVals = (obj) => {
    Object.keys(obj).reduce((acc, key) => {
        obj[key] = obj[key].toLowerCase();
    });
    return obj;
};

module.exports = {
    userFromMention,
    channelIdFromMention,
    lowercaseKeys,
    lowercaseVals,
};
