const packs = require('../packs.json');
const {MessageEmbed, MessageButton} = require('discord.js');
const paginationEmbed = require('discordjs-button-pagination');

module.exports = async function interactionCreate(interaction) {
    if (interaction.isAutocomplete()) autocomplete(interaction);
    else if (interaction.isCommand() && interaction.commandName === 'packs') {
        if (interaction.options.getSubcommand() === 'discover') await onPacksDiscoverCommand(interaction);
        if (interaction.options.getSubcommand() === 'find') onPacksFindCommand(interaction);
    }
}

async function onPacksDiscoverCommand(interaction) {
    const maxItemsPerSite = 10

    const embeds = []
    for (let page = 0; page < packs.length / maxItemsPerSite; page++) {
        const packsOfSite = []
        for (let i = page * maxItemsPerSite; i < (page + 1) * maxItemsPerSite; i++) {
            if (i >= packs.length) break
            const label = generateLabel(packs[i], interaction.guild)
            packsOfSite.push(label)
        }
        embeds.push(new MessageEmbed()
            .setColor("5865F2")
            .setTitle('Packs')
            .setDescription(packsOfSite.join('\n')))
    }

    const button1 = new MessageButton()
        .setCustomId('PREVIOUS_BUTTON')
        .setLabel('<')
        .setStyle('DANGER');

    const button2 = new MessageButton()
        .setCustomId('NEXT_BUTTON')
        .setLabel('>')
        .setStyle('SUCCESS');

    const buttonList = [button1, button2]

    await paginationEmbed(interaction, embeds, buttonList);
}

function onPacksFindCommand(interaction) {
    const query = interaction.options.getString('query')
    const filteredPacks = packs.filter(pack => pack.name === query);

    if (filteredPacks.length === 0) {
        interaction.reply({
            embeds: [{
                color: 'ED4245',
                description: 'No results found!'
            }]
        })
    } else {
        const pack = filteredPacks[0]
        interaction.reply({
            embeds: [{
                color: '5865F2',
                description: `
                **${pack.name}** ${pack.author ? `by ${pack.author}` : ''}
                [\`DOWNLOAD\`](${pack.download})
                `
            }]
        })
    }
}


function autocomplete(interaction) {
    const query = interaction.options._hoistedOptions[0].value
    const filteredPacks = packs.filter(pack => {
        if (pack.name.includes(query)) return true
        if (pack.tags !== undefined) {
            if (pack.tags.some(tag => tag.includes(query))) return true;
        }
        return false;
    })
    const suggestions = filteredPacks.map(pack => {
        return {
            name: pack.name,
            value: pack.name
        }
    })
    interaction.respond(suggestions);
}

function generateLabel(pack, guild) {
    const extension = getExtension(pack)
    let label = ''
    if (extension !== undefined) {
        const emoji = guild.emojis.cache.find(it => it.name === extension)
        const emojiMention = `<:${emoji.name}:${emoji.id}>`
        label += `${emojiMention} `
    }
    label += `[${pack.name}](${pack.download})`
    if (pack.author !== undefined) label += ` - ${pack.author}`
    return label
}

function getExtension(pack) {
    if (pack.file !== undefined) return pack.file
    else {
        const fileExtensions = ['c4d', 'lib4d', 'blend']
        const split = pack.download.split('.')
        const extensionRaw = split[split.length - 1]
        if (fileExtensions.includes(extensionRaw)) {
            if (extensionRaw === 'lib4d') return 'c4d'
            return extensionRaw;
        } else return undefined;
    }
}