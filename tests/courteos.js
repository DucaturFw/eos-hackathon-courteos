const EosHelper = require('./eos-helper')
const eosHelper = new EosHelper()

const config = require('../config')


async function go() {

    // Initialize contract
    if (false) {

        const resultInitialize = await eosHelper.courteosDeploy(owner, oracle)
        console.log('Initializing contract was successful:')
        //console.log(resultInitialize)

    }

    // Change contract owner
    if (false) {

        const resultChangeOwnerA = await eosHelper.l2dexChangeOwner(oracle, user)
        console.log('Changing contract owner was successful (forward):')
        //console.log(resultChangeOwnerA)

        const resultChangeOwnerB = await eosHelper.l2dexChangeOwner(oracle, owner)
        console.log('Changing contract owner was successful (backward):')
        //console.log(resultChangeOwnerB)

    }

    // Deposit to the contract
    if (false) {

        const resultDeposit = await eosHelper.l2dexDeposit(user, symbol, amountDeposit)
        console.log('Deposit to the contract was successful:')
        //console.log(resultDeposit)

    }

    // Push off-chain transaction from contract owner
    if (false) {

        const message = SignatureHelper.serializeMessage(user.name, symbol, changeUser, nonceUser, apply)
        const messageHash = SignatureHelper.sha256(Buffer.from(message))
        const signature = SignatureHelper.sign(messageHash, user.active.privateKey)
        const resultPushTransaction = await eosHelper.l2dexPushTransaction(owner, user.name, symbol, changeUser, nonceUser, apply ? 1 : 0, signature)
        console.log('Push off-chain transaction was successful:')
        //console.log(resultPushTransaction)

    }

    // Push off-chain transaction from channel owner
    if (false) {

        const message = SignatureHelper.serializeMessage(user.name, symbol, changeOwner, nonceOwner, false)
        const messageHash = SignatureHelper.sha256(Buffer.from(message))
        const signature = SignatureHelper.sign(messageHash, owner.active.privateKey)
        const resultPushTransaction = await eosHelper.l2dexPushTransaction(user, user.name, symbol, changeOwner, nonceOwner, 0, signature)
        console.log('Push off-chain transaction was successful:')
        //console.log(resultPushTransaction)

    }

    // Withdraw some tokens from the channel
    if (false) {

        const resultWithdraw = await eosHelper.l2dexWithdraw(user, symbol, amountWithdraw)
        console.log('Withdraw from the contract was successful:')
        //console.log(resultWithdraw)

    }

}

go()
