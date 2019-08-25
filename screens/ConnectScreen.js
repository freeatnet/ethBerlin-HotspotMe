import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import ConnectingStatus from '../components/ConnetingStatus';

import { getChannel } from '../lib/channel';
import { micropay } from '../lib/micropay';

export default class ConnectScreen extends React.Component {
  state = {
    wifiList: [],
    connectingToSsid: '',
    recipient: '0xd0cfb387bb1874d12a1a1399dcb527f7b0b13efe',
    paymentAmount: '0.01',
  };

  componentDidMount = () => {
    this.loadAvailableWifiList();
    getChannel();
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

  handleButtonCall = (newSsid) => {
    this.setState({ connectingToSsid: newSsid });
  }

  render = () => {
    const { connectingToSsid, paymentAmount, recipient } = this.state;
    return (
      <View style={{
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'center', 
      }}>

        <View style={styles.container}>
          <Text style={styles.titleText}>
            List of Available Wi-Fi
          </Text>
          <View style={styles.container}>
            <FlatList
              data={this.state.wifiList}
              renderItem={({ item }) => <ConnectingStatus item={item} reset={item.ssid !== connectingToSsid} handleButtonCall={this.handleButtonCall} />}
            />
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.container}>
            <Text style={styles.titleText}>
              Recipient:{'\n'}{recipient}
            </Text>
            <TouchableOpacity
              onPress={() => micropay(paymentAmount, recipient)}
              style={styles.helpLink}>
              <Text style={styles.linkText}>
                {'\n'}Submit $0.01 Payment{'\n'}
              </Text>
            </TouchableOpacity>
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
