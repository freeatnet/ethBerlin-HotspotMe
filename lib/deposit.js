import { minBN, toBN, tokenToWei, weiToToken } from "./bn";
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

const deposit = async (balance, channel, swapRate, token) => {
  const { minDeposit, maxDeposit } = await getDepositLimits(swapRate, ethprovider);
  if (!channel) {
    console.warn(`Channel not available yet.`);
    return;
  }
  if (balance.onChain.ether.wad.eq(Zero)) {
    console.debug(`No on-chain eth to deposit`)
    return;
  }

  let nowMaxDeposit = maxDeposit.wad.sub(this.state.balance.channel.total.wad);
  if (nowMaxDeposit.lte(Zero)) {
    console.debug(`Channel balance (${balance.channel.total.toDAI().format()}) is at or above ` +
      `cap of ${maxDeposit.toDAI(swapRate).format()}`)
    return;
  }

  if (balance.onChain.token.wad.gt(Zero)) {
    this.setPending({ type: "deposit", complete: false, closed: false });
    const amount = minBN([
      Currency.WEI(nowMaxDeposit, swapRate).toDAI().wad,
      balance.onChain.token.wad
    ]);
    const depositParams = {
      amount: amount.toString(),
      assetId: token.address.toLowerCase(),
    };
    console.log(`Depositing ${depositParams.amount} tokens into channel: ${channel.opts.multisigAddress}`);
    const result = await channel.deposit(depositParams);
    await this.refreshBalances();
    await this.refreshBalances();
    console.log(`Successfully deposited tokens! Result: ${JSON.stringify(result, null, 2)}`);
    this.setPending({ type: "deposit", complete: true, closed: false });
  } else {
    console.debug(`No tokens to deposit`);
  }

  nowMaxDeposit = maxDeposit.wad.sub(this.state.balance.channel.total.wad);
  if (nowMaxDeposit.lte(Zero)) {
    console.debug(`Channel balance (${balance.channel.total.toDAI().format()}) is at or above ` +
      `cap of ${maxDeposit.toDAI(swapRate).format()}`)
    return;
  }
  if (balance.onChain.ether.wad.lt(minDeposit.wad)) {
    console.debug(`Not enough on-chain eth to deposit: ${balance.onChain.ether.toETH().format()}`)
    return;
  }

  this.setPending({ type: "deposit", complete: false, closed: false });
  const amount = minBN([
    balance.onChain.ether.wad.sub(minDeposit.wad),
    nowMaxDeposit,
  ]);
  console.log(`Depositing ${amount} wei into channel: ${channel.opts.multisigAddress}`);
  const result = await channel.deposit({ amount: amount.toString() });
  await this.refreshBalances();
  console.log(`Successfully deposited ether! Result: ${JSON.stringify(result, null, 2)}`);
  this.setPending({ type: "deposit", complete: true, closed: false });
  this.autoSwap();
}

module.exports = { deposit }
