import React, { Component } from 'react';
import { TextInput } from 'react-native';

export default class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { text: 'Useless Placeholder' };
  }

  handleChangePriceRate = async (text) => {
    this.setState({text})
  }

  render() {
    return (
      <TextInput
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        onChangeText={this.handleChangePriceRate}
        value={this.state.text}
      />
    );
  }
}

SettingsScreen.navigationOptions = {
  title: 'app.json',
};
