const config = require("../config.json")

module.exports = {
    messageCreate: async (message) => {
        if (message.member.roles.cache.map(role => role.id).includes(config.roles.owner)) return
        const regex = /(http(s)?:\/\/)?discord\.gg\/.+/g
        if (regex.test(message.content)) return message.delete()
    }
}