import { Alert } from "react-native";
import { ILocation } from "../utils/ILocation";

/**
 * Function to show an alert when a ride request is received.
 *
 * @param {string} payload - Message payload from the backend describing the ride request.
 * @param {function} acceptRide - Callback function to accept the ride request, passing the target station's location.
 * @param {function} cancelRide - Callback function to cancel the ride request, passing the target station's location.
 * @param {ILocation} targetStation - The location of the target station for the ride request.
 */
export const showRideRequestAlert = (
  payload: string, // Message payload from the backend
  acceptRide: (targetStation: ILocation) => void,
  cancelRide: (targetStation: ILocation) => void,
  targetStation: ILocation
) => {
  Alert.alert(
    "Ride Request",
    payload, // Use the backend's payload for the alert body
    [
      {
        text: "Cancel",
        onPress: () => cancelRide(targetStation),
        style: "cancel",
      },
      {
        text: "Accept",
        onPress: () => acceptRide(targetStation),
      },
    ],
    { cancelable: false }
  );
};

/**
 * Function to show an alert when a ride is canceled.
 *
 * @param {string} payload - Message payload from the backend explaining the ride cancellation.
 */
export const showRideCancellationAlert = (payload: string) => {
  Alert.alert(
    "Ride Canceled",
    payload, // Display the payload from the backend for ride cancellation
    [
      {
        text: "Confirm",
        onPress: () => console.log("Ride cancellation confirmed"),
        style: "default",
      },
    ],
    { cancelable: false }
  );
};
