const config = require('../config.json')
const {Permissions, MessageActionRow, MessageButton} = require('discord.js');

module.exports = {
    interactionCreate: async (interaction) => {
        if (interaction.isCommand() && interaction.commandName === 'ticket') {
            const subcommand = interaction.options._subcommand;
            if (subcommand === 'create') await onCreate(interaction);
            else if (subcommand === 'close') await onClose(interaction);
        } else if (interaction.isButton()) {
            await onOpen(interaction)
        }
    }
}

async function onCreate(interaction) {
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('support')
                .setLabel('Support')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('designer-rank')
                .setLabel('Request rank up')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('partner-rank')
                .setLabel('Request partner')
                .setStyle('PRIMARY'),
        );

    await interaction.reply({
        content: `Hi **${interaction.user.username}**,\nPlease select a topic as why you've opened this ticket.`,
        components: [row],
        ephemeral: true
    })
}

async function onOpen(interaction) {
    let category = null
    if (interaction.customId === "support") {
        category = interaction.guild.channels.cache
            .filter(it => it.type === 'GUILD_CATEGORY')
            .find(it => it.id === config.tickets.support)
    } else if (interaction.customId === "designer-rank") {
        category = interaction.guild.channels.cache
            .filter(it => it.type === 'GUILD_CATEGORY')
            .find(it => it.id === config.tickets.designerRank)
    } else if (interaction.customId === "partner-rank") {
        category = interaction.guild.channels.cache
            .filter(it => it.type === 'GUILD_CATEGORY')
            .find(it => it.id === config.tickets.partner)
    }

    if (category === null) return await interaction.reply(":warning: Invalid input")

    const channelName = "🔓" + interaction.user.username
    const options = {
        type: 'GUILD_TEXT',
        permissionOverwrites: [
            {
                id: interaction.guild.id,
                deny: [Permissions.FLAGS.VIEW_CHANNEL]
            },
            {
                id: interaction.user.id,
                allow: [Permissions.FLAGS.VIEW_CHANNEL]
            }
        ]
    }

    for (let i = 0; i <config.tickets.moderator; i++) {
        console.log(config.tickets.moderator[i]);
        options.permissionOverwrites.push({
            id: config.tickets.moderator[i],
            allow: [Permissions.FLAGS.VIEW_CHANNEL]
        })
    }
    const channel = await category.createChannel(channelName, options)

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