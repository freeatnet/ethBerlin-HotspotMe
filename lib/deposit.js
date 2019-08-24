import { minBN, toBN, tokenToWei, weiToToken } from "./bn";
import { getBalance } from "./channel";
import { Currency } from "./currency";

// Constants for channel max/min - this is also enforced on the hub
const WITHDRAW_ESTIMATED_GAS = toBN("300000");
const DEPOSIT_ESTIMATED_GAS = toBN("25000");
const MAX_CHANNEL_VALUE = Currency.DAI("30");

const getDepositLimits = async (swapRate, ethProvider) => {
  let gasPrice = await ethprovider.getGasPrice();
  let totalDepositGasWei = DEPOSIT_ESTIMATED_GAS.mul(toBN(2)).mul(gasPrice);
  let totalWithdrawalGasWei = WITHDRAW_ESTIMATED_GAS.mul(gasPrice);
  const minDeposit = Currency.WEI(totalDepositGasWei.add(totalWithdrawalGasWei), swapRate).toETH();
  const maxDeposit = MAX_CHANNEL_VALUE.toETH(swapRate); // Or get based on payment profile?
  return ({ maxDeposit, minDeposit })
}

const depositAndSwap = async (balance, channel, swapRate, token) => {
  let currentBalance = balance
  const { minDeposit, maxDeposit } = await getDepositLimits(swapRate, ethprovider);
  if (!channel) {
    console.warn(`Channel not available yet.`);
    return;
  }
  if (!token) {
    console.warn(`Token not available yet.`);
    return;
  }
  if (currentBalance.onChain.ether.wad.eq(Zero)) {
    console.debug(`No on-chain eth to deposit`)
    return;
  }
  let nowMaxDeposit = maxDeposit.wad.sub(currentBalance.channel.total.wad);
  if (nowMaxDeposit.lte(Zero)) {
    console.debug(`Channel balance (${currentBalance.channel.total.toDAI().format()}) is at or above ` +
      `cap of ${maxDeposit.toDAI(swapRate).format()}`)
    return;
  }
  if (currentBalance.onChain.token.wad.gt(Zero)) {
    const tokenAmount = minBN([
      Currency.WEI(nowMaxDeposit, swapRate).toDAI().wad,
      currentBalance.onChain.token.wad
    ]);
    console.log(`Depositing ${depositParams.amount} tokens into channel: ${channel.opts.multisigAddress}`);
  } else {
    console.debug(`No tokens to deposit`);
  }
  const ethAmount = minBN([
    currentBalance.onChain.ether.wad.sub(minDeposit.wad),
    nowMaxDeposit,
  ]);
  console.log(`Depositing ${ethAmount} wei into channel: ${channel.opts.multisigAddress}`);
  await this.state.connext.deposit({
    amountWei: ethAmount.toString(),
    amountToken: tokenAmount.toString(),
  }, { gasPrice });
  currentBalance = getBalance() 
  console.log(`Successfully deposited ether! Result: ${JSON.stringify(result, null, 2)}`);
  if (currentBalance.channel.token.wad.gte(maxDeposit.toDAI(swapRate).wad)) {
    return; // swap ceiling has been reached, no need to swap more
  }
  const maxSwap = tokenToWei(maxDeposit.toDAI().wad.sub(currentBalance.channel.token.wad), swapRate)
  const weiToSwap = minBN([currentBalance.channel.ether.wad, maxSwap])
  console.log(`Attempting to swap ${formatEther(weiToSwap)} eth for dai at rate: ${swapRate}`);
  await this.state.connext.exchange(weiToSwap, "wei");
}

module.exports = { depositAndSwap }
