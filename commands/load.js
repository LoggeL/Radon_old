const fetch = require('node-fetch')

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
    const client = message.client

    const guild = message.guild

    if (!guild) return message.reply('Invalid Server')

    let member = guild.members.get(message.author.id)
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
    if (backupMessage.author != client.user)
      return message.reply('This is not an official backup')

    const backupAttachment = backupMessage.attachments.first()
    if (!backupAttachment) return message.reply("Didn't find the backup file")

    const backup = await fetch(backupAttachment.url).then(response =>
      response.json()
    )
    console.log(backup)
  },
}
