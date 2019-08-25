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

import ConnectingStatus from "../components/ConnetingStatus";

import { getChannel } from "../lib/channel";
import { micropay } from "../lib/micropay";
import { startDiscovery, startWifiSession } from "../lib/discovery/discovery";

export default class ConnectScreen extends React.Component {
  state = {
    wifiList: [],
    connectingToSsid: "",
    connectionState: null,
    recipient: "0xd0cfb387bb1874d12a1a1399dcb527f7b0b13efe",
    paymentAmount: "0.01"
  };

  componentDidMount = () => {
    this.loadAvailableWifiList();
    getChannel();
  };

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
          setNetworksList({
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

    startWifiSession(endpoint.serviceId, endpoint.endpointId);

    setTimeout(() => {
      wifi.findAndConnect(endpoint.ssid, endpoint.wifiPassword, found => {
        if (found) {
          setTimeout(() => {
            micropay(endpoint.price, recipient);
            this.setState({ connectionState: "connected" });
          }, 10000);
        } else {
          console.log("wifi is not in range");
        }
      });
    }, 1000);
  };

  render = () => {
    const {
      connectingToSsid,
      paymentAmount,
      recipient,
      connectionState
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
          <Text style={styles.titleText}>
            Recipient:{"\n"}
            {recipient}
          </Text>
        </View>
      </View>
    );
  };
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
