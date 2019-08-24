import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  ToastAndroid,
  ListView
} from "react-native";
import Hotspot from "react-native-wifi-hotspot";

import NearbyConnection, {
  CommonStatusCodes,
  ConnectionsStatusCodes,
  Strategy,
  Payload,
  PayloadTransferUpdate
} from "react-native-google-nearby-connection";

import { startAdvertising } from "../lib/discovery/advertisement";

const WALLET = "0x3591c4f43313cb1a53ff7edc7a5cc378e8ac2241";
const RATE = 1.953125e15;
const SSID = "AVIN-Xi";
const WIFI_PASSWORD = "MyWifiPass";

export default class App extends Component {
  state = {
    isAdvertising: false
  };
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const peers = [];
    this.state = {
      peers,
      dataSource: this.ds.cloneWithRows(peers)
    };
  }

  componentDidMount() {
    if (!this.state.isAdvertising) {
      startAdvertising(WALLET, RATE, SSID, WIFI_PASSWORD);

      this.setState({ isAdvertising: true });
      console.log("NearbyConnection is advertising");

      NearbyConnection.onReceivePayload(
        ({
          serviceId, // A unique identifier for the service
          endpointId, // ID of the endpoint we got the payload from
          payloadType, // The type of this payload (File or a Stream) [See Payload](https://developers.google.com/android/reference/com/google/android/gms/nearby/connection/Payload)
          payloadId // Unique identifier of the payload
        }) => {
          console.log("NearbyConnection, server received payload like", {
            serviceId, // A unique identifier for the service
            endpointId, // ID of the endpoint we got the payload from
            payloadType, // The type of this payload (File or a Stream) [See Payload](https://developers.google.com/android/reference/com/google/android/gms/nearby/connection/Payload)
            payloadId // Unique identifier of the payload
          });

          NearbyConnection.readBytes(
            serviceId, // A unique identifier for the service
            endpointId, // ID of the endpoint wishing to stop playing audio from
            payloadId // Unique identifier of the payload
          ).then(
            ({
              type, // The Payload.Type represented by this payload
              bytes, // [Payload.Type.BYTES] The bytes string that was sent
              payloadId, // [Payload.Type.FILE or Payload.Type.STREAM] The payloadId of the payload this payload is describing
              filename, // [Payload.Type.FILE] The name of the file being sent
              metadata, // [Payload.Type.FILE] The metadata sent along with the file
              streamType // [Payload.Type.STREAM] The type of stream this is [audio or video]
            }) => {
              console.log("NearbyConnection read bytes: ", {
                type, // The Payload.Type represented by this payload
                bytes, // [Payload.Type.BYTES] The bytes string that was sent
                payloadId, // [Payload.Type.FILE or Payload.Type.STREAM] The payloadId of the payload this payload is describing
                filename, // [Payload.Type.FILE] The name of the file being sent
                metadata, // [Payload.Type.FILE] The metadata sent along with the file
                streamType // [Payload.Type.STREAM] The type of stream this is [audio or video]
              });
            }
          );
        }
      );
    }
  }

  componentWillUnmount() {
    NearbyConnection.stopAdvertising("com.hotspotme:wifi-provider");
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>React native Hotspot library</Text>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.subtitle}>
            Enable & Check if it already opened
          </Text>
          <Button title="enable" onPress={() => this.enable()} />
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.subtitle}>
            Disable & Check if it already disabled
          </Text>
          <Button title="disable" onPress={() => this.disable()} />
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.subtitle}>
            Set your hotspot seetings (SSID, PASSWORD, ...)
          </Text>
          <Button title="create" onPress={() => this.create()} />
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.subtitle}>Fetch hotspot settings</Text>
          <Button title="fetch" onPress={() => this.fetch()} />
        </View>
        <View>
          <Text style={styles.subtitle}>Show all peers</Text>
          <Button title="peers" onPress={() => this.peers()} />
        </View>
        <ListView
          dataSource={this.state.dataSource}
          style={{ marginTop: 15 }}
          renderRow={(peer, index) => {
            return (
              <View style={styles.viewList} key={index}>
                <Text style={styles.viewText}>{peer.device}</Text>
                <Text style={styles.viewText}>{peer.ip}</Text>
                <Text style={styles.viewText}>{peer.mac}</Text>
              </View>
            );
          }}
          enableEmptySections
        />
      </View>
    );
  }
  enable() {
    Hotspot.enable(
      () => {
        ToastAndroid.show("Hotspot Enabled", ToastAndroid.SHORT);
      },
      err => {
        ToastAndroid.show(err.toString(), ToastAndroid.SHORT);
      }
    );
  }
  disable() {
    Hotspot.disable(
      () => {
        ToastAndroid.show("Hotspot Disabled", ToastAndroid.SHORT);
      },
      err => {
        ToastAndroid.show(err.toString(), ToastAndroid.SHORT);
      }
    );
  }
  create() {
    const hotspot = { SSID: "ASSEM", password: "helloworld" };
    Hotspot.create(
      hotspot,
      () => {
        ToastAndroid.show("Hotspot enstablished", ToastAndroid.SHORT);
      },
      err => {
        ToastAndroid.show(err.toString(), ToastAndroid.SHORT);
      }
    );
  }
  fetch() {
    Hotspot.getConfig(
      config => {
        ToastAndroid.show(config.ssid, ToastAndroid.SHORT);
      },
      err => {
        ToastAndroid.show(err.toString(), ToastAndroid.SHORT);
      }
    );
  }
  peers() {
    Hotspot.peersList(
      data => {
        const peers = JSON.parse(data);
        this.setState({ peers, dataSource: this.ds.cloneWithRows(peers) });
      },
      err => {
        ToastAndroid.show(err.toString(), ToastAndroid.SHORT);
      }
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#F5FCFF",
    margin: 8
  },
  welcome: {
    fontSize: 20,
    height: 60,
    lineHeight: 50
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5
  },
  viewList: {
    backgroundColor: "#F1F1F1",
    marginBottom: 10
  },
  viewText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black"
  }
});
