import { ethers as eth } from "ethers";
import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import {
  Clipboard,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Currency } from "../lib/currency";
import { MonoText } from '../components/StyledText';
import { getBalance, getChannel, getSwapRate, getToken } from '../lib/channel';
import { depositAndSwap } from '../lib/deposit';

function getNetwork(chainId) {
  switch(chainId.toString()) {
    case '1':
      return 'mainnet';
    case '4':
      return 'rinkeby';
    default:
      console.log(`Unsupported chain id: ${channel.opts.ethChainId}`)
      return 'unknown';
  }
}

function handleAddressPress(network, address) {
  const prefix = network === 'mainnet' ? '' : `${network}.`
  WebBrowser.openBrowserAsync(
    `https://${prefix}etherscan.io/address/${address}`
  );
}

function handleCopyPress(address) {
  Clipboard.setString(address);
}

const zeroBalance = {
  channel: {
    ether: Currency.ETH("0"),
    token: Currency.DAI("0"),
  },
  onChain: {
    ether: Currency.ETH("0"),
    token: Currency.DAI("0"),
  },
}

export default class WalletScreen extends Component {
  state = {
    address: '',
    balance: zeroBalance,
    channel: null,
    network: 'unknown',
    swapRate: '?',
    token: null,
  };

  componentDidMount() {
    this.setupChannel();
    this.refreshBalance();
  }

  setupChannel = async () => {
    let { channel, token } = this.state;
    if (!channel) {
      channel = await getChannel();
    }
    this.setState({
      address: channel.wallet.address,
      channel,
      network: getNetwork(channel.opts.ethChainId),
    });
    if (!token) {
      token = await getToken();
    }
    this.setState({ token });
  }

  refreshBalance = async () => {
    this.setState({ balance: zeroBalance })
    const balance = await getBalance();
    console.log(`Got updated balances`)
    const swapRate = await getSwapRate();
    console.log(`Got updated swapRate`)
    this.setState({ balance, swapRate })
  }

  render() {
    const { address, balance, channel, network, swapRate, token } = this.state
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>

          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>
              {'\n\n'}
            </Text>
          </View>

          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>
              Channel ready? {channel === null ? 'nope' : 'yep'}
            </Text>
          </View>

          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>
              Connected to eth network: {network}
            </Text>
          </View>

          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>
              Current Eth-DAI swap rate: {swapRate}
            </Text>
          </View>

          <View style={styles.helpContainer}>
            <TouchableOpacity
              onPress={() => this.refreshBalance()}
              style={styles.helpLink}>
              <Text style={styles.helpLinkText}>
                Refresh Balances{'\n'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>
              {'\n'}Current on-chain wallet balance:{'\n'}
              {balance.onChain.ether.format()}{'\n'}
              {balance.onChain.token.format()}
            </Text>
          </View>

          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>
              {'\n'}Current in-channel wallet balance:{'\n'}
              {balance.channel.ether.format()}{'\n'}
              {balance.channel.token.format()}
            </Text>
          </View>

          <View style={styles.helpContainer}>
            <TouchableOpacity
              onPress={() =>
                depositAndSwap(balance, channel, swapRate, token, this.setState.bind(this))}
              style={styles.helpLink}>
              <Text style={styles.helpLinkText}>
                Deposit{'\n'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>
              {"\n"}
            </Text>
          </View>

          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>
              Send funds to this address to deposit:
            </Text>
          </View>

          <View style={styles.helpContainer}>
            <TouchableOpacity
              onPress={() => handleAddressPress(network, address)}
              style={styles.helpLink}>
              <Text style={styles.helpLinkText}>
                {address}               
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.helpContainer}>
            <TouchableOpacity
              onPress={() => handleCopyPress(address)}
              style={styles.helpLink}>
              <Text style={styles.helpLinkText}>
                Copy to clipboard
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    );
  }
}

WalletScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});

