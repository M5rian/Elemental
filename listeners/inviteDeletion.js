module.exports = {
    messageCreate: async (message) => {
        const regex = /(http(s)?:\/\/)?discord\.gg\/.+/g
        if (regex.test(message.content)) return message.delete()
    }
}