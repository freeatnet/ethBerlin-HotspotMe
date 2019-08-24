import * as WebBrowser from "expo-web-browser";
import React from "react";
import {
  Image,
  Switch,
  StyleSheet,
  Text,
  View,
  Button,
} from "react-native";

import ToggleHotspotButton from "../components/ToggleHotspotButton";

export default class HomeScreen extends React.Component {
  state = {
    address: "",
    hotspot: true,
    channel: null,
    network: "",
  };

  toggleHotspot = () => {
    if (this.state.hotspot) {
      this.setState({ hotspot: false });
    } else {
      this.setState({ hotspot: true });
    }
  };

  onPressDisconnectUser = () => {
    // TODO: do something!
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.mainContainer}>
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
          <ToggleHotspotButton
            hotspot={this.state.hotspot}
            toggleHotspot={this.toggleHotspot}
          />
        </View>
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  hotspotSwitch: {
    marginTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  userImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)"
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center"
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  },
  consumedText: {
    fontSize: 24,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 32,
    textAlign: 'center',
  },
});
