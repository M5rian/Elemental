const {MessageActionRow, MessageButton} = require('discord.js');
const config = require('../config.json');

module.exports = async function messageCreate(message) {
    if (message.author.id === '639544573114187797') {
        if (message.content === '!eval button::create') await sendStartingGuide(message)
        //else if (message.content.startsWith('!eval')) await runEvalCommand()
    }
    if (message.member.roles.cache.some(role => role.id === config.roles.owner)) {
        if (message.content.startsWith('!eval send')) await sendInput(message)
    }
}

async function sendInput(message) {
    await message.channel.send({
        //content: '@everyone',
        embeds: [{
            color: '5865F2',
            description: message.content.substring("!eval send".length),
        }]
    })
}

function createActionRowOf(items) {
    const rows = []
    for (let i = 0; i < items.length; i++) {
        if (i % 5 === 0) {
            rows.push(new MessageActionRow())
        }
        rows[rows.length - 1] = rows[rows.length - 1].addComponents(items[i])
    }
    return rows
}

async function sendStartingGuide(message) {
    const buttons = config.reactionButtons.map(it => {
        return new MessageButton()
            .setLabel(it.name)
            .setStyle('PRIMARY')
            .setCustomId(it.id)
    })

    await message.channel.send({
        embeds: [{
            title: 'Welcome designers!',
            color: '#5865F2',
            description: `
                Elemental Studios is a server dedicated to improve and share your designs with other designers!
                Select some roles below, to show others who you are!

                Underneath you can find all information you will need to get you started in our server! If you still have questions after reading this, just contact one of our staff members!

                **🏆 Designer ranks**
                You want to get some cool and shiny designer ranks? Go and post your best designs in <#952239937980350494>! You'll receive a rank depending on how good your design is.
                If you're mad because you didn't get god designer improve your designs and come back later! The better designs you send the higher rank you'll receive!

                **🙋 You need help?**
                We made a ticket system, which you can use to get support. For this type in a channel the following command: .open. This will create a channel for you where you can explain your problem!
                Don't be afraid to use this feature, our staff members are here to help, even if you think you're question is dumb ;)
                
                **Rules**
                Nobody likes them but without them we can't keep the server safe.
                
                I. Disrespecting other members is not allowed
                II. We give objective opinions
                III. Rule evasion or attempts to test the limits of what is possible is not allowed
                IV. Don't pretend to have designs which aren't yours
                V. You need to follow the teams instructions
                VI. If you want to advertise, use <#952238481822871592>. Don't promote cruelty, violence, self-harm, suicide, pornography or a Discord server. Also do not DM advertise!
                VII. Follow [Discord's terms of service](https://discord.com/terms) and make sure you follow [Discord's community](https://discord.com/guidelines) guidelines.

                [**🔗 Invite**](https://discord.gg/dSNf98zVtT)`
        }],
        components: createActionRowOf(buttons)
    })
}

async function runEvalCommand(message) {
    const code = message.content.split(new RegExp('\\s+'), 2)[1]
    try {
        const response = eval(code)

        const json = JSON.stringify(response, null, 2).substring(0, 4000) + '\n[...]'
        message.channel.send({
            embeds: [{
                description: '```json\n' + json + '```'
            }]
        })
    } catch (e) {
        message.channel.send({
            embeds: [{
                description: '```json\n' + e.message + '```'
            }]
        })
    }
}