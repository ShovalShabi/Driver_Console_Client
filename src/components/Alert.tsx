import { Alert } from "react-native";
import { ILocation } from "../utils/ILocation";

// Function to show an alert when a ride request is received
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

// Function to show an alert when a ride is canceled
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
