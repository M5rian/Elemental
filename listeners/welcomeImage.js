const {Canvas, loadImage, createCanvas} = require('canvas');
const {MessageAttachment} = require('discord.js');
const config = require('../config.json')

module.exports = async function guildMemberAdd(event) {
    const canvas = createCanvas(1920, 1080);
    const context = canvas.getContext('2d');

    const background = await loadImage('./background.jpg');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.font = '100px sans-serif';
    context.fillStyle = '#FFFFFF';
    context.fillText('Welcome', canvas.width / 2 - 250, canvas.height / 2 - 50);

    context.font = calculateFontSize(canvas, event.user.username, 200, 1100);
    context.fillStyle = '#FFFFFF';
    context.fillText(event.user.username, canvas.width / 2 - 250, canvas.height / 2 + 125);

    context.beginPath();
    context.arc(canvas.width / 7.5 + 150, canvas.height / 2 - 150 + 150, 150, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();
    const avatar = await loadImage(event.user.displayAvatarURL({format: 'jpg'}));
    context.drawImage(avatar, canvas.width / 7.5, canvas.height / 2 - 150, 300, 300);

    const channel = event.guild.channels.cache.get(config.channels.welcome)
    const attachment = new MessageAttachment(canvas.toBuffer(), 'profile-image.png');
    await channel.send({files: [attachment]})
}

const calculateFontSize = (canvas, text, startSize, maxWidth) => {
    const context = canvas.getContext('2d');
    context.font = `${startSize}px sans-serif`;
    let size = startSize
    while (context.measureText(text).width > maxWidth) {
        context.font = `${size -= 10}px sans-serif`;
    }
    return context.font
};