import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Button,
} from 'react-native';


export default class ConnectScreen extends React.Component {
  state = { wifiList: [], connecting: '' };

  componentDidMount() {
    this.loadAvailableWifiList();
  }

  loadAvailableWifiList = () => {
    // TODO: load list
    this.setState({
      wifiList: [
        { key: 'YOyo-wifi', ssid: 'YOyo-wifi', price: 7 },
        { key: 'ple4se d0nt', ssid: 'ple4se d0nt', price: 3 },
        { key: 'hello!', ssid: 'hello!', price: 5 },
      ]
    });
  }

  onPressConnectToNetwork = (itemSSID) => {
    alert("item ", itemSSID, " -> ", this.state.connecting, itemSSID === this.state.connecting);
    this.setState({ connecting: itemSSID});
    // TODO: connect!
  }

  networkItem(item) {

    let networkState;
    if (item.ssid === this.state.connecting) {
      networkState = <Text>Connecting...</Text>;
    } else {
      networkState = <Button
        onPress={() => { this.onPressConnectToNetwork(item.ssid); }}
        title="Connect"
        color="#841584"
      />
    }

    return (
      <View style={styles.alternativeLayoutButtonContainer}>
        <View style={{ height: 50 }}>
          <Text style={styles.item}>{item.ssid}</Text>
        </View>
        <View style={{ width: 50, height: 50, backgroundColor: 'powderblue' }}>
          <Text style={styles.item}>${item.price}</Text>
        </View>
        <View style={{ width: 50, height: 50 }}>
          {networkState}
          {/* TODO: exchange for loading icon when connecting */}
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>
          List of Available Wi-Fi
        </Text>
        <View style={styles.container}>
          <FlatList
            data={this.state.wifiList}
            renderItem={({ item }) => this.networkItem(item)}
          />
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
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  alternativeLayoutButtonContainer: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});