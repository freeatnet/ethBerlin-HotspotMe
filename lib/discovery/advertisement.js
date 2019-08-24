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

    NearbyConnection.onReceivePayload(
      ({
        serviceId, // A unique identifier for the service
        endpointId, // ID of the endpoint we got the payload from
        payloadType, // The type of this payload (File or a Stream) [See Payload](https://developers.google.com/android/reference/com/google/android/gms/nearby/connection/Payload)
        payloadId // Unique identifier of the payload
      }) => {
        // Payload has been received
        console.log("NearbyConnection.onReceivePayload", {
          serviceId, // A unique identifier for the service
          endpointId, // ID of the endpoint we got the payload from
          payloadType, // The type of this payload (File or a Stream) [See Payload](https://developers.google.com/android/reference/com/google/android/gms/nearby/connection/Payload)
          payloadId, // Unique identifier of the payload
          returnEarly: payload.payloadType !== Nearby_Payload.BYTES
        });

        if (payloadType !== Nearby_Payload.BYTES) {
          return;
        }

        NearbyConnection.readBytes(
          serviceId, // A unique identifier for the service
          endpointId, // ID of the endpoint wishing to stop playing audio from
          payloadId // Unique identifier of the payload
        ).then(({ type, bytes, payloadId, filename, metadata, streamType }) => {
          // The Payload.Type represented by this payload // [Payload.Type.BYTES] The bytes string that was sent // [Payload.Type.FILE or Payload.Type.STREAM] The payloadId of the payload this payload is describing // [Payload.Type.FILE] The name of the file being sent // [Payload.Type.FILE] The metadata sent along with the file // [Payload.Type.STREAM] The type of stream this is [audio or video]
          console.log("NearbyConnection.readBytes", {
            type, // The Payload.Type represented by this payload
            bytes, // [Payload.Type.BYTES] The bytes string that was sent
            payloadId, // [Payload.Type.FILE or Payload.Type.STREAM] The payloadId of the payload this payload is describing
            filename, // [Payload.Type.FILE] The name of the file being sent
            metadata, // [Payload.Type.FILE] The metadata sent along with the file
            streamType // [Payload.Type.STREAM] The type of stream this is [audio or video]
          });

          ToastAndroid.showWithGravity(
            JSON.stringify(bytes),
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          );
        });
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
