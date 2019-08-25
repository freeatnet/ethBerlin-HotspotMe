import { ethers as eth } from "ethers";
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
const timer = require('react-native-timer');
import ConnectingStatus from '../components/ConnetingStatus';

import { toBN } from '../lib/bn';
import { Currency } from '../lib/currency';
import { getChannel } from '../lib/channel';
import { micropay } from '../lib/micropay';

const streamName = 'PaymentStream'
const { formatEther, parseEther } = eth.utils

export default class ConnectScreen extends React.Component {
  state = {
    balance: 'loading',
    channel: null,
    connectedToSsid: '',
    paymentAmount: '0.01',
    recipient: '',
    streaming: false,
    wifiList: [],
  };

  componentDidMount = () => {
    this.loadAvailableWifiList();
    this.handleButtonCall.bind(this)
    this.getBalance()
    this.getProviderAddress()
  }

  getBalance = async () => {
    const channel = await getChannel()
    const tokenBalance = (await channel.getState()).persistent.channel.balanceTokenUser
    this.setState({ balance: Currency.DEI(tokenBalance).toDAI() })
    return tokenBalance;
  }

  // TODO: write this for real
  getProviderAddress = (ssid) => {
    this.setState({ recipient: '0xd0cfb387bb1874d12a1a1399dcb527f7b0b13efe' })
  }

  // TODO: write this for real
  getDataUsage = () => {
    return Date.now()
  }

  // TODO: write this for real
  loadAvailableWifiList = () => {
    this.setState({ wifiList: [
      { key: 'YOyo-wifi', ssid: 'YOyo-wifi', price: 0.12 },
      { key: 'ple4seD0', ssid: 'ple4se d0nt', price: 0.09 },
      { key: 'hello!', ssid: 'hello!', price: 0.11 },
    ] });
  }

  handleButtonCall = (newSsid) => {
    // start stream?
    console.log(`Connecting to: ${newSsid}`)
    this.setState({ connectedToSsid: newSsid });
    if (newSsid) {
      this.startPaymentStream()
    } else {
      this.stopPaymentStream()
    }
  }

  getProviderAddress = () => {
    const recipient = '0xd0cfb387bb1874d12a1a1399dcb527f7b0b13efe'
    this.setState({ recipient })
    return recipient
  }

  startPaymentStream = () => {
    const { paymentAmount, recipient } = this.state
    this.channel = getChannel();
    console.log(`Starting payment stream`)
    // TODO: get data usage, calculate charge
    timer.setInterval(
      streamName,
      async () => {
        console.log(`Sending ${parseEther(paymentAmount)} to ${recipient}`)
        await micropay(paymentAmount, recipient)
        console.log(`Success! (hopefully)`)
        this.getBalance()

      },
      3000,
    )
  }

  stopPaymentStream = () => {
    console.log(`Stopping payment stream`)
    timer.clearInterval(streamName)
  }

  render = () => {
    const { balance, connectedToSsid, paymentAmount, recipient } = this.state;
    return (
      <View style={{
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'center', 
      }}>

        <View style={styles.container}>
          <Text style={styles.titleText}>
            Balance: {balance.format ? balance.format() : balance}{'\n'}
          </Text>
          <Text style={styles.titleText}>
            List of Available Wi-Fi
          </Text>
          <View style={styles.container}>
            <FlatList
              data={this.state.wifiList}
              extraData={this.state}
              renderItem={({ item }) => {
                if (connectedToSsid && connectedToSsid !== item.ssid) {
                  return null;
                } else {
                  return (<ConnectingStatus
                    item={item}
                    reset={item.ssid !== connectedToSsid}
                    handleButtonCall={this.handleButtonCall}
                  />)
                }
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}

ConnectScreen.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: '#fff',
  },
  titleText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
    textAlign: 'center',
  },
});
