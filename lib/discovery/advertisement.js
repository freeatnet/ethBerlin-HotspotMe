import { ToastAndroid } from "react-native";

import NearbyConnection, {
  CommonStatusCodes,
  ConnectionsStatusCodes,
  Strategy,
  Payload,
  PayloadTransferUpdate
} from "react-native-google-nearby-connection";

import { SERVICE_ID, ENDPOINT_NAME } from "./constants";

function startAdvertising(wallet, rate, ssid, wifiPassword) {
  NearbyConnection.onAdvertisingStarted(({ endpointName, serviceId }) => {
    // The name of the service thats started to advertise // A unique identifier for the service
    // Advertising service has started
    console.log("NearbyConnection.onAdvertisingStarted", {
      endpointName,
      serviceId
    });

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
          endpointId, // ID of the endpoint wishing to connect
          endpointName, // The name of the remote device we're connecting to.
          authenticationToken, // A small symmetrical token that has been given to both devices.
          serviceId, // A unique identifier for the service
          incomingConnection // True if the connection request was initated from a remote device.
        });

        console.log(
          "NearbyConnection.acceptConnection",
          NearbyConnection.acceptConnection(
            serviceId, // A unique identifier for the service
            endpointId // ID of the endpoint wishing to accept the connection from
          )
        );
      }
    );
  });

  NearbyConnection.onAdvertisingStartFailed(error => {
    // Failed to start advertising service
    console.error(error);
  });

  NearbyConnection.startAdvertising(
    [wallet, rate.toString(), ssid, wifiPassword].join(";"), // This nodes endpoint name
    SERVICE_ID, // A unique identifier for the service
    Strategy.P2P_CLUSTER // The Strategy to be used when discovering or advertising to Nearby devices [See Strategy](https://developers.google.com/android/reference/com/google/android/gms/nearby/connection/Strategy)
  );
}

export { startAdvertising };
