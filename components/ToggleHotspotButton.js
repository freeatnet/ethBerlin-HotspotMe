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
        return (
            <Button
                icon={
                    <Icon
                        name="wifi"
                        size={15}
                        color="white"
                    />}
                title="Hotspot"
            />
        );
    }
  }

  export default ToggleHotspotButton;
