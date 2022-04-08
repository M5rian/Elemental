const config = require('../config.json')

module.exports = {
    interactionCreate: async (interaction) => {
        if (interaction.isCommand() && interaction.commandName === 'rank') await onCommand(interaction)
    }
}

async function onCommand(interaction) {
    // Permission check
    if (!interaction.member.roles.cache.some(role => config.roles.rolemanager === role.id)) {
        await interaction.reply({
            ephemeral: true,
            content: ':warning: What are you trying to do? Only rolemanagers are allowed to do that.'
        })
        return
    }

    const member = interaction.options.getMember('member');
    if (member === undefined) {
        await interaction.reply({
            ephemeral: true,
            content: ':warning: This user is not in the server'
        })
        return
    }
    const messageAuthor = `<@${member.id}>`

    const role = interaction.options.getRole('role')
    if (!config.designerRoles.includes(role.id)) {
        await interaction.reply({
            ephemeral: true,
            content: ':warning: This user is not a designer role'
        })
        return
    }
    const currentRoles = member.roles.cache.filter(role => config.designerRoles.includes(role.id))

    let currentRole = null
    currentRoles.forEach(role => {
        if (currentRole === null) currentRole = role
        else if (role.position > currentRole.position) currentRole = role
    })

    // Uprank
    if ((currentRole === null || role.position > currentRole.position) && role !== undefined) {
        // User had no roles before
        if (currentRole === null) {
            await interaction.reply({
                embeds: [{
                    title: 'Rank up!',
                    color: '57F287',
                    thumbnail: {url: member.displayAvatarURL()},
                    description: `${messageAuthor} You reached your first designer role, congratulations 🎉! You are now ${role}!`,
                    footer: {text: `Rolemanager: ${interaction.user.tag}`}
                }]
            })
        }
        // Maximum role is already reached
        else if (currentRole.id === config.designerRoles[0]) {
            await interaction.reply({
                embeds: [{
                    title: 'No rank up... Kinda',
                    color: '5865F2',
                    thumbnail: {url: member.displayAvatarURL()},
                    description: `${messageAuthor} master, you are already the best 😁!`,
                    footer: {text: `Rolemanager: ${interaction.user.tag}`}
                }]
            })
        }
        // Normal rank up
        else {
            await interaction.reply({
                embeds: [{
                    title: 'Rank up!',
                    color: '57F287',
                    thumbnail: {url: member.displayAvatarURL()},
                    description: `${messageAuthor} rank up 🎉! You are now ${role}!`,
                    footer: {text: `Rolemanager: ${interaction.user.tag}`}
                }]
            })
        }
    }
    // Downrank
    else if (role === null || role.position < currentRole.position) {
        // User lost all ranks
        if (role === null && currentRole.id === config.designerRoles[--config.designerRoles]) {
            await interaction.reply({
                embeds: [{
                    title: 'Down rank!',
                    color: 'ED4245',
                    thumbnail: {url: member.displayAvatarURL()},
                    description: `${messageAuthor} you lost all your roles... But don't give up! Just send in new designs 😊!`,
                    footer: {text: `Rolemanager: ${interaction.user.tag}`}
                }]
            })
        }
        // User had no ranks before too
        else if (currentRoles.size === 0) {
            await interaction.reply({
                ephemeral: true,
                content: 'LOL you have no ranks and you got none too'
            })
        }
        // Normal down rank
        else {
            await interaction.reply({
                embeds: [{
                    title: 'Down rank!',
                    color: 'ED4245',
                    thumbnail: {url: member.displayAvatarURL()},
                    description: `${messageAuthor} down rank 💀! You are now ${role}!`,
                    footer: {text: `Rolemanager: ${interaction.user.tag}`}
                }]
            })
        }
    }
    // Rank stays
    else {
        await interaction.reply({
            embeds: [{
                title: 'No rank up',
                color: '5865F2',
                thumbnail: {url: member.displayAvatarURL()},
                description: `${messageAuthor} you don't seem to have improved... Maybe you have more luck next time 😉!`,
                footer: {text: `Rolemanager: ${interaction.user.tag}`}
            }]
        })
    }

    currentRoles.forEach(role => member.roles.remove(role))
    if (role !== null) member.roles.add(role)
}

async function onRankStay(interaction, author, member) {
    const messageAuthor = `<@${member.id}>`

}

async function onRankUp(interaction, author, member) {
    const messageAuthor = `<@${member.id}>`

    const roles = member.roles.cache
    const roleIds = roles.map(role => role.id)

    for (let i = 0; i < config.designerRoles.length; i++) {
        if (!roleIds.includes(config.designerRoles[i])) continue

        // Maximum role is reached
        if (i === 0) {


        }
        // Normal rank up
        else {
            let roleToRemove = config.designerRoles[i] // Get next role (lower index)
            let roleToAdd = config.designerRoles[--i]
            member.roles.remove(roleToRemove)
            member.roles.add(roleToAdd)

            const role = `<@&${roleToAdd}>`

        }
        return

    }
    // User had no roles before
    const roleToAdd = config.designerRoles[config.designerRoles.length - 1]
    member.roles.add(roleToAdd)
    const role = `<@&${roleToAdd}>`

}

async function onRankDown(interaction, author, member) {
    const messageAuthor = `<@${member.id}>`

    const roles = member.roles.cache
    const roleIds = roles.map(role => role.id)

    console.log(config.designerRoles.length)
    for (let i = 0; i < config.designerRoles.length; i++) {
        if (!roleIds.includes(config.designerRoles[i])) continue

        // Minimum role is reached
        if (i === config.designerRoles.length - 1) {

        }
        // Normal rank down
        else {
            let roleToRemove = config.designerRoles[i]
            let roleToAdd = config.designerRoles[++i]
            member.roles.remove(roleToRemove)
            member.roles.add(roleToAdd)

            const role = `<@&${roleToAdd}>`

        }
        return

    }

    // User had no roles before`


}