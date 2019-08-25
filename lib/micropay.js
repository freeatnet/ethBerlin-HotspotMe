import { ethers as eth } from "ethers";
const timer = require('react-native-timer');

import { maxBN, minBN, toBN, tokenToWei, weiToToken } from "./bn";
import { getBalance, getChannel } from "./channel";
import { Currency } from "./currency";

import { ethUrl } from "../constants/eth";

const { Zero } = eth.constants
const { formatEther, parseEther } = eth.utils

const micropay = async (amount, recipient) => {
  if (!recipient) {
    console.log(`No recipient provided! Aborting!`)
    return
  }
  const channel = await getChannel();
  const state = (await channel.getState()).persistent
  const tokenBalance = Currency.DEI(state.channel.balanceTokenUser).toDAI();
  console.log(`Got balance of ${tokenBalance.format()}`)
  if (tokenBalance.wad.lt(parseEther(amount))) {
    console.log(`Not enough money to make this payment`)
    return
  }
  const payment = { payments: [{
    amountToken: parseEther(amount).toString(),
    amountWei: Zero.toString(),
    recipient,
  }] }
  console.log(`Preparing to make payment: ${JSON.stringify(payment)}`)
  try {
    await channel.buy(payment)
    console.log(`Yay successfully sent payment on our first try`)
  } catch (e) {
    console.log(`First payment attempt didn't work: ${e.message}`)
    // if payment failed due to not enough collateralization, the hub will collateralize
    const intervalName = 'WaitingForCollateral'
    await new Promise((res, rej) => {
      let iterations = 0
      timer.setInterval(
        intervalName,
        async () => {
          // returns null if no collateral needed
          let needsCollateralNow = await channel.recipientNeedsCollateral(
            recipient,
            payment.payments[0],
          );
          if (!needsCollateralNow) {
            console.log(`Yay recipient is collateralized`)
            res();
          }
          if (iterations > 20) {
            console.log(`It's been too long, I give up`)
            timer.clearInterval(intervalName)
            rej('Timeout waiting for hub to collateralize')
          }
          iterations = iterations + 1
          console.log(`Recipient still isn't collateralized`)
        },
        5000,
      );
    })
    try {
      console.log(`Let's try this payment thing again`)
      await channel.buy(payment)
    } catch (e) {
      console.log(`Ok that one failed too. sad. ${e.message}`)
    }
  }
}

export { micropay }
