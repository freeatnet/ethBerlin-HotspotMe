import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList
} from 'react-native';
import ConnectingStatus from '../components/ConnetingStatus';


export default class ConnectScreen extends React.Component {
  state = { wifiList: [] };

  componentDidMount = () => {
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

  render = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>
          List of Available Wi-Fi
        </Text>
        <View style={styles.container}>
          <FlatList
            data={this.state.wifiList}
            renderItem={({ item }) => <ConnectingStatus item={item} />}
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
  }
});
