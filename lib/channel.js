import { AsyncStorage } from 'react-native';
import * as connext from "connext";
import { ethers as eth } from "ethers";
import tokenArtifacts from "openzeppelin-solidity/build/contracts/ERC20Mintable.json";

import { medianizerAbi } from "./medianizerAbi";
import { Currency } from "./currency";
import { hubUrl, ethUrl, MEDIANIZER_ADDRESS } from "../constants/eth"

var mnemonic = false
const getMnemonic = async () => {
  if (mnemonic) { return mnemonic }
  try {
    mnemonic = await AsyncStorage.getItem('@mnemonic')
    if(mnemonic) {
      console.log(`Found an old mnemonic: "${mnemonic}"`)
      return mnemonic
    }
  } catch(e) {
    console.error(`Oh no, couldn't get from storage, idk what to do..`)
  }
  mnemonic = eth.Wallet.createRandom().mnemonic
  console.log(`Created a new random mnemonic: "${mnemonic}"`)
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
    const ethprovider = new eth.providers.JsonRpcProvider(ethUrl)
    const gasPrice = await ethprovider.getGasPrice();
    const opts = {
      hubUrl,
      mnemonic: await getMnemonic(),
      ethUrl,
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
    await channel.start(); // starting also sets the store
    resolve(channel);
  })
  return channel;
}

var token = false
const getToken = async () => {
  if (token) { return token }
  const channel = await getChannel();
  const wallet = eth.Wallet.fromMnemonic(await getMnemonic()).connect(new eth.providers.JsonRpcProvider(ethUrl))
  token = new eth.Contract(channel.opts.tokenAddress, tokenArtifacts.abi, wallet);
  return token
}

const tenMins = 10 * 60 * 1000
var swapRate = { value: false, time: 0 }
const getSwapRate = async () => {
  if (swapRate.value && swapRate.time + tenMins >= Date.now()) {
    console.log(`Using old swap rate, it's not that old`)
    return swapRate.value
  }
  console.log(`Fetching new swap rate from medianizer`)
  const ethprovider = eth.getDefaultProvider();
  const medianizer = new eth.Contract(MEDIANIZER_ADDRESS, medianizerAbi, ethprovider);
  const rawRate = await medianizer.peek()
  swapRate = { value: eth.utils.formatEther(rawRate[0]), time: Date.now() }
  return swapRate.value;
}

const getBalance = async () => {
  const ethprovider = new eth.providers.JsonRpcProvider(ethUrl);
  const channel = await getChannel()
  const address = channel.wallet.address;
  const token = await getToken();
  const balance = { onChain: {}, channel: {} }
  const state = (await channel.getState()).persistent
  balance.onChain.ether = Currency.WEI(await ethprovider.getBalance(address)).toETH();
  balance.onChain.token = Currency.DEI(await token.balanceOf(address)).toDAI();
  balance.channel.ether = Currency.WEI(state.channel.balanceWeiUser).toETH();
  balance.channel.token = Currency.DEI(state.channel.balanceTokenUser).toDAI();
  return balance;
}

module.exports = { getBalance, getChannel, getSwapRate, getToken }
