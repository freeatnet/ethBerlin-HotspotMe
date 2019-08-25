import * as WebBrowser from "expo-web-browser";
import React from "react";
import {
  Image,
  Switch,
  StyleSheet,
  Text,
  View,
  Button,
  KeyboardAvoidingView,
} from "react-native";

import ToggleHotspotButton from "../components/ToggleHotspotButton";
import SetRate from "../components/SetRate";
import { whileStatement } from "@babel/types";

export default class HomeScreen extends React.Component {
  state = {
    address: "",
    hotspot: true,
    channel: null,
    network: "",
    rate: "1.25",
    mbsconsumed: "34.78",
  };

  toggleHotspot = () => {
    if (this.state.hotspot) {
      this.setState({ hotspot: false });
    } else {
      this.setState({ hotspot: true });
    }
  };

  setRateFunc = (newRate) => {
    this.setState({ rate: newRate})
  }

  updateConsumption = (mbs) => {  // to be called when ejected
    mbsStr = str(mbs);
    this.setState({ mbsconsumed: mbsStr });
  }

  calculateTotal = () => {
    total=(parseFloat(this.state.rate)*parseFloat(this.state.mbsconsumed)).toFixed(2) 
    return total.toString()
  }

  render() {
    return (
      <View 
      style={{
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'center', 
      }}>
        <View style={styles.mainContainer}>
          {/* <Image
            source={require('../assets/images/robot-dev.png')}
            style={styles.userImage}
          /> */}
          <View style={{
            padding: 100,
          }}>
            <Text style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              So far, this user has consumed:
            </Text>
            <Text style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
               {this.state.mbsconsumed} Mbs at {this.state.rate}/Mbs
            </Text>
            <Text style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
               for a total of ${this.calculateTotal()}
            </Text>
          
            <SetRate setRateFunc={this.setRateFunc} rate={this.state.rate}/>
          </View>
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
