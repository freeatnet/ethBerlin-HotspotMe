import { ToastAndroid } from "react-native";
import NearbyConnection, {
  CommonStatusCodes,
  ConnectionsStatusCodes,
  Strategy,
  Payload,
  PayloadTransferUpdate
} from "react-native-google-nearby-connection";

import { SERVICE_ID } from "./constants";

function startDiscovery(cb) {
  NearbyConnection.onDiscoveryStartFailed(error => {
    console.error(error);
  });

  NearbyConnection.onDiscoveryStarted(({ serviceId }) => {
    // A unique identifier for the service
    console.log("NearbyConnection.onDiscoveryStarted", {
      serviceId // A unique identifier for the service
    });

    NearbyConnection.onEndpointDiscovered(
      ({
        endpointId, // ID of the endpoint wishing to connect
        endpointName, // The name of the remote device we're connecting to.
        serviceId // A unique identifier for the service
      }) => {
        console.log("NearbyConnection.onEndpointDiscovered", {
          endpointId, // ID of the endpoint wishing to connect
          endpointName, // The name of the remote device we're connecting to.
          serviceId // A unique identifier for the service
        });

        const [wallet, rateAsString, ssid, wifiPassword] = endpointName.split(
          ";"
        );

        ToastAndroid.show(
          [wallet, rateAsString, ssid, wifiPassword].toString(),
          ToastAndroid.LONG
        );

        cb({
          endpointName,
          endpointId,
          serviceId,
          wallet,
          price: parseFloat(rateAsString),
          ssid,
          wifiPassword
        });
      }
    );

    NearbyConnection.onEndpointLost(event => {
      // Endpoint moved out of range or disconnected
      console.log("NearbyConnection.onEndpointLost", event);
      const { endpointName } = event;
      cb({ endpointName, lost: true });
    });
  });

  NearbyConnection.startDiscovering(
    SERVICE_ID // A unique identifier for the service
  );
}

function startWifiSession(serviceId, endpointId) {
  NearbyConnection.onConnectionInitiatedToEndpoint(
    ({
      endpointId, // ID of the endpoint wishing to connect
      endpointName, // The name of the remote device we're connecting to.
      authenticationToken, // A small symmetrical token that has been given to both devices.
      serviceId, // A unique identifier for the service
      incomingConnection // True if the connection request was initated from a remote device.
    }) => {
      // Connection has been initated
      console.log("NearbyConnection.onConnectionInitiatedToEndpoint", {
        endpointId,
        endpointName,
        serviceId,
        incomingConnection
      });

      console.log(
        "NearbyConnection.acceptConnection",
        NearbyConnection.acceptConnection(
          serviceId, // A unique identifier for the service
          endpointId // ID of the endpoint wishing to accept the connection from
        )
      );

      NearbyConnection.onConnectedToEndpoint(
        ({
          endpointId, // ID of the endpoint we connected to
          endpointName, // The name of the service
          serviceId // A unique identifier for the service
        }) => {
          console.log("NearbyConnection.onConnectedToEndpoint", {
            endpointId, // ID of the endpoint we connected to
            endpointName, // The name of the service
            serviceId // A unique identifier for the service
          });

          const bytes = "wifi pls";
          NearbyConnection.sendBytes(
            serviceId, // A unique identifier for the service
            endpointId, // ID of the endpoint wishing to stop playing audio from
            bytes // A string of bytes to send
          );

          ToastAndroid.showWithGravity(
            `Message sent to ${serviceId} / ${endpointId}`,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          );

          NearbyConnection.disconnectFromEndpoint(
            serviceId, // A unique identifier for the service
            endpointId // ID of the endpoint we wish to disconnect from
          );
        }
      );
    }
  );

  NearbyConnection.connectToEndpoint(
    serviceId, // A unique identifier for the service
    endpointId // ID of the endpoint to connect to
  );
}

export { startDiscovery, startWifiSession };
