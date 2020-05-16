const fetch = require('node-fetch')
const decompress = require('iltorb').decompressSync;

module.exports = {
  name: 'load',
  description:
    'Loads a backup in a guild if you have ADMINISTRATOR permissions in it',
  cooldown: 60,
  aliases: ['lo', 'l'],
  usage: '[BackupID]',
  args: true,
  guildOnly: true,
  async execute(message, args) {
    // ToDo
    // Support DM loads
    // Check own permissions

    const client = message.client

    const guild = message.guild

    if (!guild) return message.reply('Invalid Server')

    let member = guild.members.cache.get(message.author.id)
    if (!member) member = await guild.fetchMember(message.author.id)
    if (!member) return message.reply("Can't find you in the Server")

    if (!member.permissions.has(8))
      return message.reply(
        "You don't have a role with the ADMINISTRATOR permission"
      )

    let dmChannel = message.author.dmChannel
    if (!dmChannel) dmChannel = await message.author.createDM()
    const backupMessage = await dmChannel.messages.fetch(args[0])

    if (!backupMessage)
      return message.reply("Coulnd't find the backup in our DM history")

    //Prevent loading 3rd party backups :P
    if (backupMessage.author !== client.user)
      return message.reply('This is not an official backup')

    const backupAttachment = backupMessage.attachments.first()
    if (!backupAttachment) return message.reply("Didn't find the backup file")

    fetch(backupAttachment.url)
      .then(response => response.buffer())
      .then(backupBuffer => decompress(backupBuffer))
      .then(backupString => { console.log(backupString.toString()); JSON.parse(backupString.toString('utf-8')) })
      .then(backup => {

        // Purge Server
        guild.channels.forEach(channel =>
          channel.delete(`Backup loaded by ${member.user.tag}`)
        )
        guild.roles
          .filter(role => role.deletable)
          .forEach(role => role.delete(`Backup loaded by ${member.user.tag}`))

        // Load Backup
      }).catch(console.error)
  }
}
