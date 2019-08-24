import { ethers as eth } from "ethers";
import { minBN, toBN, tokenToWei, weiToToken } from "./bn";
import { getBalance } from "./channel";
import { Currency } from "./currency";

import { ethUrl } from "../constants/eth";

const { Zero } = eth.constants
const { formatEther, parseEther } = eth.utils

// Constants for channel max/min - this is also enforced on the hub
const DEPOSIT_ESTIMATED_GAS = toBN("800000");
const MAX_CHANNEL_VALUE = Currency.DAI("30");
const DUST = parseEther("0.001");

const getDepositLimits = (swapRate, gasPrice) => {
  let totalDepositGasWei = DEPOSIT_ESTIMATED_GAS.mul(toBN(2)).mul(gasPrice);
  const minDeposit = Currency.WEI(totalDepositGasWei).toETH();
  const maxDeposit = MAX_CHANNEL_VALUE.toETH(swapRate); // Or get based on payment profile?
  return ({ maxDeposit, minDeposit })
}

const depositAndSwap = async (balance, channel, swapRate, token) => {
  let currentBalance = balance
  const ethprovider = new eth.providers.JsonRpcProvider(ethUrl)
  const gasPrice = await ethprovider.getGasPrice();
  const { minDeposit, maxDeposit } = getDepositLimits(swapRate, gasPrice);
  if (!channel) {
    console.warn(`Channel not available yet.`);
    return;
  }
  if (!token) {
    console.warn(`Token not available yet.`);
    return;
  }
  const totalChannel = currentBalance.channel.ether.wad.add(currentBalance.channel.token.toETH(swapRate).wad)
  let nowMaxDeposit = maxDeposit.wad.sub(totalChannel);
  if (nowMaxDeposit.lte(DUST)) {
    console.debug(`Channel balance (${formatEther(totalChannel)} eth) is at or above ` +
      `cap of ${maxDeposit.toDAI(swapRate).format()}`)
    return;
  }
  let tokenAmount = Zero
  if (currentBalance.onChain.token.wad.gt(DUST)) {
    tokenAmount = minBN([
      Currency.WEI(nowMaxDeposit, swapRate).toDAI().wad,
      currentBalance.onChain.token.wad
    ]);
    console.log(`Depositing ${tokenAmount} tokens into channel`);
  } else {
    console.debug(`No tokens to deposit`);
  }
  const ethAmount = minBN([
    currentBalance.onChain.ether.wad.sub(minDeposit.wad),
    nowMaxDeposit,
  ]);
  if (ethAmount.gt(DUST)) {
    console.log(`Depositing ${ethAmount} wei into channel`);
    await channel.deposit({
      amountWei: ethAmount.toString(),
      amountToken: tokenAmount.toString(),
    }, { gasPrice });
    currentBalance = getBalance() 
    console.log(`Successfully deposited ether!`);
  } else {
    console.log(`Not enough on-chain eth to cover gas money: ${formatEther(ethAmount)}`);
  }
  if (currentBalance.channel.token.wad.gte(maxDeposit.toDAI(swapRate).wad)) {
    console.log(`swap ceiling has been reached, no need to swap more`);
    return;
  }
  const maxSwap = tokenToWei(maxDeposit.toDAI().wad.sub(currentBalance.channel.token.wad), swapRate)
  const weiToSwap = minBN([currentBalance.channel.ether.wad, maxSwap])
  if (weiToSwap.gt(DUST)) {
    console.log(`Attempting to swap ${formatEther(weiToSwap)} eth for dai at rate: ${swapRate}`);
    await channel.exchange(weiToSwap.toString(), "wei");
    console.log(`Successful swap`);
  } else {
    console.log(`Not enough eth to swap for dai: ${formatEther(weiToSwap)}`);
  }
}

module.exports = { depositAndSwap }
