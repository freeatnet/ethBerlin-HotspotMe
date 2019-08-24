import React from 'react';
//import Button from 'react-native-button';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';


// const ToggleHotspotButton = () => (
//     <Button
//         title="Outline button"
//         type="outline"
//         buttonStyle={{
//           backgroundColor: "rgba(92, 99,216, 1)"
//         }}
//     />
//   );

class ToggleHotspotButton extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    _handlePress() {
        console.log('Pressed!');
    }
    

    render() {
        if(this.props.hotspot) {
            return (
                <Button
                    icon={
                        <Icon
                            name="wifi"
                            size={15}
                            color="white"
                        />}
                    title=" Disable Hotspot"
                    onPress={this.props.toggleHotspot}
                />
            )
        }
        else {
            return (
                <Button
                    icon={
                        <Icon
                            name="wifi"
                            size={15}
                            color="white"
                        />}
                    title=" Enable Hotspot"
                    onPress={this.props.toggleHotspot}
                />
            );
        }
    }
  }

  export default ToggleHotspotButton;
