const EosHelper = require('./eos-helper')
const eosHelper = new EosHelper()

const config = require('../config')

const bytes = 1024 * 1024
const net = 100
const cpu = 100

const account = config.accounts.courteos
const keys = { owner: account.owner.publicKey, active: account.active.publicKey }


async function go(account, keys, bytes, net, cpu) {

    //const resultCreateToken = await eosHelper.createAccount(account.name, keys)
    //console.log(`Created account '${account.name}':`)
    //console.log(resultCreateToken)
    
    //const resultBuyRAM = await eosHelper.buyRAM(account.name, bytes)
    //console.log(`Bought ${bytes} bytes for account '${account.name}':`)
    //console.log(resultBuyRAM)
    
    //const resultBuyBandwidth = await eosHelper.buyBandwidth(account.name, net, cpu)
    //console.log(`Bought resources for account '${account.name}':`)
    //console.log(resultBuyBandwidth)

}

go(account, keys, bytes, net, cpu)
