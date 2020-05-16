const compress = require('iltorb').compressSync;

module.exports = {
  name: 'backup',
  description:
    'Creates a backup of a server if you have ADMINISTRATOR permissions in it',
  cooldown: 10,
  aliases: ['bu', 'b'],
  usage: '[ServerID]',
  //args: true,
  async execute(message, args) {
    const client = message.client
    if (!args && !message.guild) return message.reply('Server ID needed')

    const guild = args[0] ? client.guilds.cache.get(args[0]) : message.guild
    if (!guild) return message.reply('Invalid Server ID!')

    let member = guild.members.cache.get(message.author.id)
    if (!member) member = await guild.fetchMember(message.author.id)
    if (!member) return message.reply("Can't find you in the Server")

    if (!member.permissions.has(8))
      return message.reply(
        "You don't have a role with the ADMINISTARTOR permission"
      )

    // Begin Backup
    let backup = {}
    backup.version = 1 // For possible incompatibilities

    backup.channels = guild.channels.cache.map(channel => ({
      id: channel.id,
      name: channel.name,
      type: channel.type,
      position: channel.position,
      parentID: channel.parentID,
      permissionOverwrites: channel.permissionOverwrites
        ? channel.permissionOverwrites
          .map(permisson => ({
            allow: permisson.allow,
            deny: permisson.deny,
            id: permisson.id,
          }))
          .filter(permission => guild.roles.cache.get(permission.id))
        : null, // Only role overrides
    }))

    backup.roles = guild.roles.cache
      .filter(role => !role.managed) // Don't want to backup managed roles
      .map(role => ({
        id: role.id,
        name: role.name,
        color: role.color,
        hoist: role.hoist,
        position: role.position,
        mentionable: role.mentionable,
        permission: role.permissions.bitfield,
      }))

    member
      .send('Here is your backup with the ID *loading*:', {
        files: [
          {
            name: `${guild.name}_${new Date()
              .toISOString()
              .split('T')
              .shift()}.rdn`,
            attachment: compress(Buffer.from(JSON.stringify(backup))),
          },
        ],
      })
      .then(backupMessage =>
        backupMessage.edit(
          `Here is your backup with the ID **${backupMessage.id}**`
        )
      )
  },
}
