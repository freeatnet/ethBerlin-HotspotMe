import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button
} from 'react-native';


export default class ConnectingStatus extends React.Component {

  //state object
  state = { connecting: '' };

  componentDidMount() {
    // Toggle the state every second
    setInterval(() => (
      this.setState(previousState => (
        { connecting: previousState.connecting === '' ? 'YOyo-wifi' : '' }
      ))
    ), 1000);
  }

  onPressConnectToNetwork = (itemSSID) => {
    alert("item " + itemSSID + " -> " + this.state.connecting + " -> " + (itemSSID === this.state.connecting));
    this.setState({ connecting: itemSSID});
    // TODO: connect!
  }


  render() {
    let networkState;
    if (this.props.item.ssid === this.state.connecting) {
      networkState = <Text>Connecting...</Text>;
    } else {
      networkState = <Button
        onPress={() => { this.onPressConnectToNetwork(this.props.item.ssid); }}
        title="Connect"
        color="#841584"
      />
    }

    return (
      <View style={styles.alternativeLayoutButtonContainer}>
        <View style={{ height: 50 }}>
          <Text style={styles.item}>{this.props.item.ssid}</Text>
        </View>
        <View style={{ width: 50, height: 50, backgroundColor: 'powderblue' }}>
          <Text style={styles.item}>${this.props.item.price}</Text>
        </View>
        <View style={{ width: 50, height: 50 }}>
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
