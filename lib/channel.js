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
  if (channel) { return channel }
  channel = new Promise(async (resolve, reject) => {
    const opts = {
      hubUrl,
      mnemonic: await getMnemonic(),
      ethUrl,
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
    channel.stop(); // Explitly start the pollers later if needed
    resolve(channel);
  })
  return channel;
}

const getToken = async () => {
  const channel = await getChannel();
  const wallet = eth.Wallet.fromMnemonic(await getMnemonic()).connect(new eth.providers.JsonRpcProvider(ethUrl))
  return new eth.Contract(channel.opts.tokenAddress, tokenArtifacts.abi, wallet);
}

const getSwapRate = async () => {
  const ethprovider = eth.getDefaultProvider();
  const medianizer = new eth.Contract(MEDIANIZER_ADDRESS, medianizerAbi, ethprovider);
  const rawRate = await medianizer.peek()
  const swapRate = eth.utils.formatEther(rawRate[0]);
  return swapRate;
}

const getBalance = async () => {
  const ethprovider = new eth.providers.JsonRpcProvider(ethUrl);
  const channel = await getChannel()
  const address = channel.wallet.address;
  const token = await getToken();
  const swapRate = await getSwapRate();
  const balance = { onChain: {}, channel: {} }
  balance.onChain.ether = Currency.WEI(await ethprovider.getBalance(address), swapRate).toETH();
  balance.onChain.token = Currency.DEI(await token.balanceOf(address), swapRate).toDAI();
  return balance;
}

module.exports = { getBalance, getChannel, getSwapRate }
