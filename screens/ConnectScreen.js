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
  wifiConnectionWatcherInterval = null;

  state = {
    wifiList: [],
    connectingToSsid: "",
    connectionState: null,
    recipient: "0xd0cfb387bb1874d12a1a1399dcb527f7b0b13efe",
    paidAmount: 0
  };

  componentDidMount = () => {
    this.loadAvailableWifiList();
    getChannel();
  };

  componentWillUnmount() {
    // const { connectingToSsid, connectionState } = this.state;
    // if (connectingToSsid != null && connectionState != null) {
    //   wifi.isRemoveWifiNetwork(connectingToSsid, isRemoved => {
    //     console.log("Forgetting the wifi device - " + connectingToSsid);
    //   });
    // }
  }

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
            } catch (err) {
              console.error("micropay failed", err);
            }

            this.setState({ connectionState: "connected" });
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
