const path = require('path')
const fs = require('fs')
const Eos = require('eosjs')
const EosApi = require('eosjs-api')
const EosEcc = require('eosjs-ecc')

const config = require('../config')


class EosHelper {

    constructor() {
        config.eos.config.keyProvider.push(config.accounts.courteos.privateKey)
        this.eos = Eos(config.eos.config)
        this.contracts = {
            courteos: {
                abi: fs.readFileSync(path.resolve(__dirname, '../build/contracts/courteos.abi')),
                wasm: fs.readFileSync(path.resolve(__dirname, '../build/contracts/courteos.wasm'))
            }
        }
        this.options = {
            eos: {
                authorization: 'eosio@active',
                keyProvider: [ '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3' ],
                broadcast: true,
                sign: true
            },
            courteos: {
                authorization: `${config.accounts.courteos.name}@active`,
                keyProvider: [ config.accounts.courteos.active.privateKey ],
                broadcast: true,
                sign: true
            }
        }
    }

    // Blockchain reading

    getInfo() {
        return this.eos.getInfo({})
    }

    getCurrencyBalance(account, symbol) {
        return this.eos.getCurrencyBalance(config.accounts.courteos.name, account, symbol)
    }

    // Accounts management

    createAccount(account, keys) {
        return this.eos.transaction(transaction => {
            return transaction.newaccount({
                creator: 'eosio',
                name: account,
                owner: keys.owner,
                active: keys.active
            })
        }, this.options.eos)
    }

    updatePermissions(account) {
        return this.eos.getAccount(account.name).then(a => {
            const permissions = JSON.parse(JSON.stringify(a.permissions))
            for (const p of permissions) {
                if (p.perm_name == 'active') {
                    // TODO: Check if already added
                    const auth = p.required_auth
                    auth.accounts.push({ permission: { actor: config.accounts.courteos.name, permission: 'eosio.code' }, weight: 1 })
                    return this.eos.updateauth({
                        account: account.name,
                        permission: p.perm_name,
                        parent: p.parent,
                        auth: auth
                    }, this.getOptionsOwner(account))
                }
            }
        })
    }

    buyRAM(account, bytes) {
        return this.eos.transaction(transaction => {
            return transaction.buyrambytes({
                payer: 'eosio',
                receiver: account,
                bytes: bytes
            })
        }, this.options.eos)
    }

    // receiver - account name which will receive bandwidth
    // network - amount of SYS tokens to spend on network usage as number
    // cpu - amount of SYS tokens to spend on CPU usage as number
    buyBandwidth(receiver, network, cpu) {
        return this.eos.transaction(transaction => {
            return transaction.delegatebw({
                from: 'eosio',
                receiver: receiver,
                stake_net_quantity: `${network}.0000 SYS`,
                stake_cpu_quantity: `${cpu}.0000 SYS`,
                transfer: 0
            })
        }, this.options.eos)
    }

    // Courteos contract management

    courteosDeploy() {
        return this.eos.setcode(config.accounts.courteos.name, 0, 0, this.contracts.courteos.wasm, this.options.courteos).then(result => {
            //console.log(result)
            return this.eos.setabi(config.accounts.courteos.name, JSON.parse(this.contracts.courteos.abi), this.options.courteos).then(result => {
                //console.log(result)
            })
        })
    }

    courteosOpenAttached(owner, oracle) {
        return this.eos.contract(config.accounts.courteos.name).then(contract => {
            return contract.initialize(
                owner.name,
                owner.active.publicKey,
                oracle.name,
                this.getOptionsActive(owner)
            )
        })
    }

    // Elliptic curve cryptography functions (ECC)

    privateKeyToPublicKey(privateKey) {
        return EosEcc.privateToPublic(privateKey)
    }

    sha256(data, encoding) {
        return EosEcc.sha256(data, encoding)
    }

    signData(data, privateKey) {
        return EosEcc.sign(data, privateKey)
    }

    signHash(hash, privateKey) {
        return EosEcc.signHash(hash, privateKey)
    }

    recoverData(data, signature) {
        return EosEcc.recover(signature, data)
    }

    recoverHash(hash, signature) {
        return EosEcc.recoverHash(signature, hash)
    }

    // Helper function

    getOptionsOwner(account) {
        return {
            authorization: `${account.name}@owner`,
            keyProvider: [ account.owner.privateKey ],
            broadcast: true,
            sign: true
        }
    }

    getOptionsActive(account) {
        return {
            authorization: `${account.name}@active`,
            keyProvider: [ account.active.privateKey ],
            broadcast: true,
            sign: true
        }
    }
}

module.exports = EosHelper
