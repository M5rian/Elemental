const config = require('../config.json')
const {Permissions} = require('discord.js');

module.exports = {
    interactionCreate: async (interaction) => {
        if (!interaction.isCommand()) return;
        if (interaction.commandName !== 'ticket') return

        const subcommand = interaction.options._subcommand;
        if (subcommand === 'create') await onCreate(interaction);
        else if (subcommand === 'close') await onClose(interaction);
    }
}

async function onCreate(interaction) {
    const category = interaction.guild.channels.cache
        .filter(it => it.type === 'GUILD_CATEGORY')
        .find(it => it.id === config.tickets.category)

    const channelName = config.tickets.channelPrefix + interaction.user.username
    const channel = await category.createChannel(channelName, {
        type: 'GUILD_TEXT',
        permissionOverwrites: [
            {
                id: interaction.guild.id,
                deny: [Permissions.FLAGS.VIEW_CHANNEL]
            },
            {
                id: interaction.user.id,
                allow: [Permissions.FLAGS.VIEW_CHANNEL]
            },
            {
                id: config.tickets.moderators,
                allow: [Permissions.FLAGS.VIEW_CHANNEL]
            }
        ]
    })

    interaction.reply({
        content: `Created a ticket, check out <#${channel.id}>`,
        ephemeral: true
    })
}

async function onClose(interaction) {
    const channel = interaction.channel;
    if (channel.parentId !== config.tickets.category) return

    const overwrites = JSON.parse(JSON.stringify(await channel.permissionOverwrites)).channel.permissionOverwrites
    for (const id of overwrites) {
        const member = interaction.guild.members.cache.find(member => member.id === id)
        if (member != null) {
            channel.permissionOverwrites.delete(id)
        }
    }

    await interaction.reply('Closed ticket ✔️')
}