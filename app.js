const config = require('./config.json');
const {Client, Intents} = require('discord.js');
const fs = require('fs');
const fetch = require('node-fetch')

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS]});
const events = fs.readdirSync('listeners').filter(f => f.endsWith('.js')).map(f => `./listeners/${f}`);
const commands = fs.readdirSync('commands').filter(f => f.endsWith('.js')).map(f => `./commands/${f}`);

// Event handling
[...events, ...commands].forEach(async (path) => {
    const event = await require(path);
    if (event.name !== undefined) {
        try {
            client.on(event.name, (...args) => event(...args))
        } catch (e) {
            console.log("error object:");
            console.log(e);
            console.log();

            console.log("error object toString():");
            console.log("\t" + e.toString());

            console.log();
            console.log("error object attributes: ");
            console.log('\tname: ' + e.name + ' message: ' + e.message + ' at: ' + e.at + ' text: ' + e.text);

            console.log();
            console.log("error object stack: ");
            console.log(e.stack);
        }
    }
});

client.on('ready', async () => {

    /*await fetch('https://discord.com/api/v8/applications/721388162223571015/commands', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bot ' + config.token
        },
        body: JSON.stringify({
            name: 'rank up',
            type: 3
        })
    })
    await fetch('https://discord.com/api/v8/applications/721388162223571015/commands', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bot ' + config.token
        },
        body: JSON.stringify({
            name: 'rank down',
            type: 3
        })
    })


    fetch('https://discord.com/api/v8/applications/721388162223571015/commands', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bot ' + config.token
        },
        body: JSON.stringify({
            name: 'rank stay',
            type: 3
        })
    })*/

    /*
    const res = await fetch('https://discord.com/api/v8/applications/721388162223571015/commands', {
        method: 'GET',
        headers: {Authorization: 'Bot ' + config.token},
    })
    console.log(await res.text())
*/


    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(config.token);