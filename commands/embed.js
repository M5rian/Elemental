const {Modal, TextInputComponent, showModal} = require('discord-modals');

module.exports = {
    interactionCreate: async (interaction) => {
        if (interaction.isCommand() && interaction.commandName === 'embed') {
            const modal = new Modal()
                .setCustomId('embed')
                .setTitle('Create an embed message')
                .addComponents(
                    new TextInputComponent()
                        .setCustomId('description')
                        .setLabel('Set the embed description here')
                        .setStyle('LONG') //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
                        .setMinLength(0)
                        .setMaxLength(4000)
                        .setPlaceholder('Description here')
                        .setRequired(true)
                )

            await showModal(modal, {
                client: interaction.client,
                interaction: interaction
            })
        }
    },

    modalSubmit: async (modal) => {
        const description = modal.getTextInputValue('description')
        await modal.channel.send({
            //content: '@everyone',
            embeds: [{
                color: '5865F2',
                description: description,
            }]
        })
        await modal.reply({
            content: 'Send!',
            ephemeral: true
        })
    }
}