import React from 'react';
import {
  Image,
  Switch,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';


export default class ProvideScreen extends React.Component {
  state = { switchValue: false }

  handlerSwitchHotspot = () => {
    // TODO: do some!
  }

  onPressDisconnectUser = () => {
    // TODO: do something!
  }

  handlerSwitchHotspot = (value) => {
    this.setState({ switchValue: value })
    // TODO: do some.
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <Switch
            onValueChange={this.handlerSwitchHotspot}
            style={styles.hotspotSwitch}
            value={this.state.switchValue}
          />
          <Image
            source={require('../assets/images/robot-dev.png')}
            style={styles.userImage}
          />
          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>
              So far, this user has consumed:
            </Text>
            <Text style={styles.consumedText}>
              78436 kb
            </Text>
          </View>
          <Button
            onPress={this.onPressDisconnectUser}
            title="Disconnect User"
            color="#841584"
            accessibilityLabel="Button to disconnect a user"
          />
        </View>
      </View>
    );
  }
}

ProvideScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  hotspotSwitch: {
    marginTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  userImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  consumedText: {
    fontSize: 24,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 32,
    textAlign: 'center',
  },
});
