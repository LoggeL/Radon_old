const compress = require('iltorb').compressSync
const decompress = require('iltorb').decompressSync
const fs = require('fs')
const fetch = require('node-fetch')

//console.log(decompress(fs.readFileSync('../../../Starter_Template_2020-05-16.rdn')).toString())
//fs.writeFileSync('../../../Starter_Template_2020-05-16.brotli', compress(fs.readFileSync('../../../Starter_Template_2020-05-16.json')))

//console.log(compress(new Buffer({ a: 1 })))

fetch('https://cdn.discordapp.com/attachments/661359401621520405/711267729889427566/Starter_Template_2020-05-16.rdn')
    .then(response => response.buffer())
    .then(backupBuffer => decompress(backupBuffer))
    .then(backupString => JSON.parse(backupString.toString('utf-8'))).then(console.log)