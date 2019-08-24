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

import { MonoText } from '../components/StyledText';
import { getChannel } from '../lib/channel';

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

export default class WalletScreen extends Component {
  state = {
    address: '',
    balance: '0.00',
    channel: null,
    network: '',
  };

  componentDidMount() {
    this.setupChannel();
  }

  setupChannel = async () => {
    console.log(`Channel so far: ${typeof channel}`)
    let { channel } = this.state;
    console.log(`Channel so far: ${typeof channel}`)
    if (!channel) {
      channel = await getChannel();
      // await new Promise((res, rej) => setTimeout(() => res('done'), 2000))
    }
    console.log(`Channel now: ${typeof channel}`)
    this.setState({
      address: channel.wallet.address,
      channel,
      network: getNetwork(channel.opts.ethChainId),
    });
  }

  render() {
    const { address, balance, channel, network } = this.state
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>

          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>
              Connected to eth network: {network}
            </Text>
          </View>

          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>
              Channel ready? {channel === null ? 'nope' : 'yep'}
            </Text>
          </View>

          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>
              Current wallet balance: ${balance}
            </Text>
          </View>

          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>
              {"\n"}
            </Text>
          </View>

          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>
              Deposit address:
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

