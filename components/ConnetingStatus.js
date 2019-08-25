import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button
} from 'react-native';


export default class ConnectingStatus extends React.Component {

  //state object
  state = {
    pending: 'none',
    connected: false,
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.reset) {
      this.setState({ connected: false, pending: 'none' });
    }
  }

  onPressConnectToNetwork = (ssid) => {
    this.props.handleButtonCall(ssid);
    if (ssid) {
      this.setState({ pending: 'connect' });
      setTimeout(() => (
        // TODO: actually connect
        this.setState({ pending: 'none', connected: true })
      ), 1000);
    } else {
      this.setState({ pending: 'disconnect' });
      setTimeout(() => (
        // TODO: actually disconnect
        this.setState({ pending: 'none', connected: false })
      ), 1000);
    }
  }


  render() {
    let networkState;
    const { connected, pending } = this.state;
    if (pending === 'connect') {
      networkState = <Text>Connecting...</Text>;
    } else if (pending === 'disconnect') {
      networkState = <Text>Disconnecting...</Text>;
    } else if (connected) {
      networkState = <Button
        onPress={() => { this.onPressConnectToNetwork(); }}
        title="Disconnect"
        color="#841584"
      />
    } else {
      networkState = <Button
      style={{borderRadius:10, borderWidth: 1, }}
        onPress={() => { this.onPressConnectToNetwork(this.props.item.ssid); }}
        title="Connect"
       
      />
    }

    return (
      <View style={styles.alternativeLayoutButtonContainer}>
        <View style={{ width: 120, height: 50 }}>
          <Text style={styles.item}>{this.props.item.ssid}</Text>
        </View>
        <View style={{ width: 50, height: 50, }}>
          <Text style={styles.item}>${this.props.item.price}</Text>
        </View>
        <View style={{ height: 50,}}>
          {networkState}
          {/* TODO: exchange for loading icon when connecting */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
