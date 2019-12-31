module.exports = {
  name: 'ping',
  description: 'Ping!',
  cooldown: 1,
  execute(message) {
    const client = message.client
    message.channel
      .send(`**Pong** 🏓\nWS: ${client.ws.ping} ms`)
      .then(pingMessage => {
        pingMessage.edit(
          `**Pong** 🏓\nWS: ${
            client.ws.ping
          } ms\nRoundtrip: ${new Date().getTime() -
            message.createdTimestamp} ms`
        )
      })
  },
}
