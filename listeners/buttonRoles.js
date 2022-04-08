const config = require('../config.json')

module.exports = async function interactionCreate(interaction) {
    if (!interaction.isButton()) return

    const roleId = interaction.customId;
    if (!config.reactionButtons.map(it => it.id).includes(roleId)) return
    const role = interaction.guild.roles.cache.find(r => r.id === roleId)

    let message;
    if (interaction.member.roles.cache.some(r => r.id === roleId)) {
        await interaction.member.roles.remove(roleId)
        message = `You lost <@&${role.id}>`
    } else {
        await interaction.member.roles.add(roleId)
        message = `You now have <@&${role.id}>`
    }

    interaction.reply({
        content: message,
        ephemeral: true
    })
}