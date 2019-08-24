import { ethers as eth } from "ethers";

const { MaxUint256, Zero } = eth.constants
const { BigNumber, bigNumberify, formatEther, parseEther } = eth.utils

export const isBN = BigNumber.isBigNumber

export const toBN = (n) =>
  bigNumberify(n.toString())

export const toWei = (n) =>
  parseEther(n.toString())

export const fromWei = formatEther

export const weiToToken = (wei, tokenPerEth) =>
  toBN(formatEther(toWei(tokenPerEth).mul(wei)).replace(/\.[0-9]*$/, ''))

export const tokenToWei = (token, tokenPerEth) =>
  toWei(token).div(toWei(tokenPerEth))

export const maxBN = (lobn) =>
  lobn.reduce((max, current) => max.gt(current) ? max : current, Zero)

export const minBN = (lobn) =>
  lobn.reduce((min, current) => min.lt(current) ? min : current, MaxUint256)

export const inverse = (bn) =>
  formatEther(toWei(toWei('1')).div(toWei(bn)))

