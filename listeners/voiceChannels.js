const config = require('../config.json');
const {Permissions} = require('discord.js');

module.exports = async function voiceStateUpdate(oldState, state) {
    if (state.channelId === config.channels.voiceHub) {
        const channel = await state.channel.parent.createChannel(state.member.user.username, {
            type: 'GUILD_VOICE', permissionOverwrites: [{
                id: state.member.id, allow: [Permissions.ALL]
            }]
        })
        await state.setChannel(channel)

    }
    if (oldState.channelId !== null && oldState.channelId !== config.channels.voiceHub) {
        if (oldState.channel.members.size === 0) await oldState.channel.delete('Channel was empty')
    }
}