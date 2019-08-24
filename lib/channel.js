import { AsyncStorage } from 'react-native';
import * as connext from "connext";
import { ethers as eth } from "ethers";
import tokenArtifacts from "openzeppelin-solidity/build/contracts/ERC20Mintable.json";

import { medianizerAbi } from "./medianizerAbi";
import { Currency } from "./currency";

var hubUrl = 'https://rinkeby.hub.connext.network/api/hub'
var ethUrl = 'https://rinkeby.hub.connext.network/api/eth'
var MEDIANIZER_ADDRESS = "0x729D19f657BD0614b4985Cf1D82531c67569197B";

const getMnemonic = async () => {
  try {
    const mnemonic = await AsyncStorage.getItem('@mnemonic')
    console.log(`Found an old mnemonic: "${mnemonic}"`)
    if(mnemonic !== null) {
      return mnemonic
    }
  } catch(e) {
    console.error(`Oh no, couldn't get from storage, idk what to do..`)
  }
  const mnemonic = eth.Wallet.createRandom().mnemonic
  console.log(`Created a random mnemonic: "${mnemonic}"`)
  try {
    await AsyncStorage.setItem('@mnemonic', mnemonic)
    return mnemonic
  } catch (e) {
    console.error(`Oh no, couldn't set to storage, idk what to do..`)
  }
  console.error(`This shouldn't ever print`)
}

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
