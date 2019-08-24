// import { AppLoading } from 'expo';
// import { Asset } from 'expo-asset';
// import * as Font from 'expo-font';
import React, { useEffect, useState } from "react";
import {
  Platform,
  PermissionsAndroid,
  StatusBar,
  StyleSheet,
  View
} from "react-native";
// import { Ionicons } from '@expo/vector-icons';
import wifi from "react-native-android-wifi";

import "./lib/fixtimerbug";
import AppNavigator from "./navigation/AppNavigator";

async function getFineLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Wifi networks",
        message: "We need your permission in order to find wifi networks"
      }
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Thank you for your permission! :)");
    } else {
      console.log("You will not able to retrieve wifi available networks list");
    }
  } catch (err) {
    console.warn(err);
  }
}

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    getFineLocationPermission();
  });

  // if (!isLoadingComplete && !props.skipLoadingScreen) {
  //   return (
  //     <AppLoading
  //       startAsync={loadResourcesAsync}
  //       onError={handleLoadingError}
  //       onFinish={() => handleFinishLoading(setLoadingComplete)}
  //     />
  //   );
  // } else {
  return (
    <View style={styles.container}>
      {Platform.OS === "ios" && <StatusBar barStyle="default" />}
      <AppNavigator />
    </View>
  );
  // }
}

async function loadResourcesAsync() {
  await Promise.all([
    // Asset.loadAsync([
    //   require('./assets/images/robot-dev.png'),
    //   require('./assets/images/robot-prod.png'),
    // ]),
    // Font.loadAsync({
    //   // This is the font that we are using for our tab bar
    //   ...Ionicons.font,
    //   // We include SpaceMono because we use it in HomeScreen.js. Feel free to
    //   // remove this if you are not using it in your app
    //   'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    // }),
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
