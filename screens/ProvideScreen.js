import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
} from 'react-native';


export default function ProvideScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>
        List of Available Wi-Fi
      </Text>
      <View style={styles.container}>
        <FlatList
          data={[
            { ssid: 'YOyo-wifi' },
            { ssid: 'ple4se d0nt' },
            { ssid: 'hello!' },
          ]}
          renderItem={({ item }) => networkItem(item)}
        />
      </View>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ width: 50, height: 50, backgroundColor: 'powderblue' }} />
        <View style={{ width: 50, height: 50, backgroundColor: 'skyblue' }} />
        <View style={{ width: 50, height: 50, backgroundColor: 'steelblue' }} />
      </View>
    </View>
  );
}
function networkItem(item) {
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <View style={{ height: 50 }}>
        <Text style={styles.item}>{item.ssid}</Text>
      </View>
      <View style={{ width: 50, height: 50, backgroundColor: 'powderblue' }} />
    </View>
  );
}

ProvideScreen.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({
  container: {
    marginTop: 20,
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
  }
});
