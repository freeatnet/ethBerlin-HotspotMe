import React, { Fragment } from 'react';
import { View } from 'react-native';
//import Button from 'react-native-button';
import { TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


class SetRate extends React.Component {
    render() {
        return (
            <View>
                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(text) => this.props.setRateFunc({text})}
                    placeholder={this.props.rate}
                />
            </View>
        )
    }
}

export default SetRate;