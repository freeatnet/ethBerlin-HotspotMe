import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button
} from 'react-native';


export default class ConnectingStatus extends React.Component {

  //state object
  state = { connecting: false, connected: false };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.reset) {
      this.setState({ connected: false, connecting: false });
    }
  }

  onPressConnectToNetwork = () => {
    this.props.handleButtonCall(this.props.item.ssid);
    this.setState({ connecting: true});
    setInterval(() => (
      this.setState({ connecting: false, connected: true })
    ), 1000);
    // TODO: connect!
  }


  render() {
    let networkState;
    const { connected, connecting } = this.state;
    if (connecting) {
      networkState = <Text>Connecting...</Text>;
    } else if (connected) {
      networkState = <Text>Connected</Text>;
    } else {
      networkState = <Button
      style={{borderRadius:10, borderWidth: 1,}}
        onPress={() => { this.onPressConnectToNetwork(this.props.item.ssid); }}
        title="Connect"
        color="#841584"
      />
    }

    return (
      <View style={styles.alternativeLayoutButtonContainer}>
        <View style={{ width: 120, height: 50 }}>
          <Text style={styles.item}>{this.props.item.ssid}</Text>
        </View>
        <View style={{ width: 50, height: 50, backgroundColor: 'powderblue' }}>
          <Text style={styles.item}>${this.props.item.price}</Text>
        </View>
        <View style={{ height: 50 }}>
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
