import * as connext from "connext";
import { ethers as eth } from "ethers";

var channel = false
const getChannel = () => {
  console.log('getting channel')
  if (channel) { return channel }
  channel = new Promise(async (resolve, reject) => {
    const opts = {
      hubUrl: 'https://rinkeby.hub.connext.network/api/hub',
      mnemonic: 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat',
      ethUrl: 'https://rinkeby.hub.connext.network/api/eth',
      logLevel: 5,
    };
    console.log(`Creating channel with opts: ${JSON.stringify(opts, null, 2)}`)
    const channel = await connext.createClient(opts);
    const address = channel.wallet.address;
    console.log(`Successfully set up connext channel! Channel config:`);
    console.log(`  - tokenAddress: ${channel.opts.tokenAddress}`);
    console.log(`  - hubAddress: ${channel.opts.hubAddress}`);
    console.log(`  - contractAddress: ${channel.opts.contractAddress}`);
    console.log(`  - ethChainId: ${channel.opts.ethChainId}`);
    console.log(`  - public address: ${address}`);
    channel.stop(); // Explitly start the channel manager when we're ready
    resolve(channel);
  })
  return channel;
}

module.exports = { getChannel: getChannel }
