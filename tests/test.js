const EosHelper = require('./eos-helper')
const eosHelper = new EosHelper()

const config = require('../config')

const accountName = config.accounts.courteos.name
const symbol = 'SYS'


async function go() {

    await eosHelper.getInfo().then(info => {
        //console.log(info)
        console.log(`Current block: ${info.head_block_num}`)
    })
    
    await eosHelper.getCurrencyBalance(accountName, symbol).then(balance => {
        console.log(`Account ${accountName} has ${balance || `no ${symbol}`}`)
    })
}

go()
