const config = require('../config.json')
const {Permissions, MessageActionRow, MessageButton} = require('discord.js');

module.exports = {
    interactionCreate: async (interaction) => {
        if (interaction.isCommand() && interaction.commandName === 'ticket') {
            const subcommand = interaction.options._subcommand;
            if (subcommand === 'create') await onTicketRequest(interaction);
            else if (subcommand === 'close') await onClose(interaction);
        } else if (interaction.isButton()) {
            const id = interaction.customId
            if (id === 'uprank' || id === 'partner' || id === 'content-creator' || id === 'support') {
                await createTicket(interaction, id)
            }
        }
    }
}

async function onTicketRequest(interaction) {
    const buttons = new MessageActionRow().addComponents(
        new MessageButton().setLabel('Rank up').setStyle('PRIMARY').setCustomId('uprank'),
        new MessageButton().setLabel('Partner').setStyle('PRIMARY').setCustomId('partner'),
        new MessageButton().setLabel('Content creator').setStyle('PRIMARY').setCustomId('content-creator'),
        new MessageButton().setLabel('Support').setStyle('PRIMARY').setCustomId('support'),
    );
    await interaction.reply({
        content: 'Please select a category below',
        components: [buttons],
        ephemeral: true
    })
}

async function createTicket(interaction, type) {
    const category = interaction.guild.channels.cache
        .filter(it => it.type === 'GUILD_CATEGORY')
        .find(it => it.id === config.tickets[type].category)

    const channelName = '🔓' + interaction.user.username
    const permissions = [
        {
            id: interaction.guild.id,
            deny: [Permissions.FLAGS.VIEW_CHANNEL]
        },
        {
            id: interaction.user.id,
            allow: [Permissions.FLAGS.VIEW_CHANNEL]
        }
    ]
    for (let modRole of config.tickets[type].moderators) {
        permissions.push({
            id: modRole,
            allow: [Permissions.FLAGS.VIEW_CHANNEL]
        })
    }
    const channel = await category.createChannel(channelName, {
        type: 'GUILD_TEXT',
        permissionOverwrites: permissions
    })

    interaction.reply({
        content: `Created a ticket, check out <#${channel.id}>`,
        ephemeral: true
    })
}

async function onClose(interaction) {
    console.log("hiu")
    const channel = interaction.channel;
    const categories = Object.keys(config.tickets).map(key => config.tickets[key]).map(ticketType => ticketType.category)
    if (!categories.includes(channel.parentId)) return

    const overwrites = JSON.parse(JSON.stringify(await channel.permissionOverwrites)).channel.permissionOverwrites
    for (const id of overwrites) {
        const member = interaction.guild.members.cache.find(member => member.id === id)
        if (member != null) {
            channel.permissionOverwrites.delete(id)
        }
    }

    channel.setName('🔒' + channel.name.substring(1))
    await interaction.reply('Closed ticket ✔️')
}