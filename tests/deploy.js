const EosHelper = require('./eos-helper')
const eosHelper = new EosHelper()


async function go() {

    const resultDeploy = await eosHelper.courteosDeploy()
    console.log('Courteos contract successfully deployed:')
    console.log(resultDeploy)

}

go()
