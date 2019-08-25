import { ethers as eth } from "ethers";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity
} from "react-native";
import wifi from "react-native-android-wifi";

const timer = require("react-native-timer");
import ConnectingStatus from "../components/ConnetingStatus";

import { toBN } from "../lib/bn";
import { getChannel } from "../lib/channel";
import { micropay } from "../lib/micropay";
import { startDiscovery, startWifiSession } from "../lib/discovery/discovery";

const streamName = "PaymentStream";
const { formatEther, parseEther } = eth.utils;

export default class ConnectScreen extends React.Component {
  wifiConnectionWatcherInterval = null;

  state = {
    balance: "?.??",
    channel: null,
    connectedToSsid: "",
    connectionState: null,
    paymentAmount: "0.01",
    paidAmount: 0,
    recipient: "",
    streaming: false,
    wifiList: []
  };

  componentDidMount = () => {
    this.loadAvailableWifiList();
    this.handleButtonCall.bind(this);
    this.getBalance();
  };

  getBalance = async () => {
    const channel = await getChannel();
    const tokenBalance = (await channel.getState()).persistent.channel
      .balanceTokenUser;
    this.setState({ balance: formatEther(tokenBalance) });
    return tokenBalance;
  };

  // TODO: write this for real
  getProviderAddress = ssid => {
    this.setState({ recipient: "0xd0cfb387bb1874d12a1a1399dcb527f7b0b13efe" });
  };

  // TODO: write this for real
  getDataUsage = () => {
    return Date.now();
  };

  // TODO: write this for real
  loadAvailableWifiList = () => {
    setTimeout(() => {
      startDiscovery(endpoint => {
        console.log(endpoint);
        const { lost } = endpoint;

        const existingEndpointsMinusDiscovery = this.state.wifiList.filter(
          ({ endpointName }) => endpointName !== endpoint.endpointName
        );

        if (!lost) {
          this.setState({
            wifiList: [endpoint, ...existingEndpointsMinusDiscovery]
          });
        } else {
          this.setState({
            wifiList: existingEndpointsMinusDiscovery
          });
        }
      });
    }, 2500);
  };

  handleButtonCall = selectedEndpointName => {
    const endpoint = this.state.wifiList.find(
      ({ endpointName }) => endpointName === selectedEndpointName
    );

    this.setState({
      connectingToSsid: endpoint.ssid,
      connectionState: "connecting",
      recipient: endpoint.wallet
    });

    startWifiSession(endpoint.serviceId, endpoint.endpointId, endpoint.wallet);

    const awaitConnectionAndPay = () => {
      fetch("https://httpbin.org/get")
        .then(async response => {
          if (response.ok) {
            try {
              await micropay(endpoint.price, endpoint.wallet);
              this.setState(function(prevState) {
                return {
                  ...prevState,
                  paidAmount: prevState.paidAmount + endpoint.price
                };
              });
              this.startPaymentStream();
              this.setState({ connectionState: "connected" });
            } catch (err) {
              console.error("micropay failed", err);
            }
          } else {
            throw new Error("response not ok");
          }
        })
        .catch(err => {
          console.warn("link not ready", err);
          setTimeout(awaitConnectionAndPay, 5000);
        });
    };

    setTimeout(() => {
      wifi.findAndConnect(endpoint.ssid, endpoint.wifiPassword, found => {
        console.log("findAndConnect callback");
        if (found) {
          console.warn("wifi is in range");
        } else {
          console.warn("wifi is not in range");
        }
      });

      awaitConnectionAndPay();
    }, 5000);
  };

  startPaymentStream = () => {
    const { paymentAmount, recipient } = this.state;
    this.channel = getChannel();
    console.log(`Starting payment stream`);
    // TODO: get data usage, calculate charge
    timer.setInterval(
      streamName,
      async () => {
        console.log(`Sending ${parseEther(paymentAmount)} to ${recipient}`);
        await micropay(paymentAmount, recipient);
        console.log(`Success! (hopefully)`);
      },
      3000
    );
  };

  stopPaymentStream = () => {
    console.log(`Stopping payment stream`);
    timer.clearInterval(streamName);
  };

  render() {
    const {
      connectingToSsid,
      recipient,
      connectionState,
      paidAmount
    } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.titleText}>List of Available Wi-Fi</Text>
          <View style={styles.container}>
            {this.state.wifiList.length > 0 ? (
              <FlatList
                data={this.state.wifiList}
                keyExtractor={({ endpointName }) => endpointName}
                extraData={this.state}
                renderItem={({ item }) => (
                  <ConnectingStatus
                    item={item}
                    connected={
                      connectingToSsid === item.ssid &&
                      connectionState === "connected"
                    }
                    connecting={
                      connectingToSsid === item.ssid &&
                      connectionState === "connecting"
                    }
                    handleButtonCall={this.handleButtonCall}
                  />
                )}
              />
            ) : (
              <ActivityIndicator size="large" color="#0000ff" />
            )}
          </View>
        </View>

        <View style={styles.container}>
          <Text>
            Recipient:{"\n"}
            {recipient}
            {"\n"}
            Paid amount:{"\n"}
            {paidAmount}
          </Text>
        </View>
      </View>
    );
  }
}

ConnectScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: "#fff"
  },
  titleText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
    textAlign: "center"
  }
});
