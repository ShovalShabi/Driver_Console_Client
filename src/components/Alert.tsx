import { Alert } from "react-native";

// Function to show an alert when a ride request is received
export const showRideRequestAlert = (
  acceptRide: () => void,
  cancelRide: () => void
) => {
  Alert.alert(
    "Ride Request",
    "You have a new ride request. Would you like to accept it?",
    [
      {
        text: "Cancel",
        onPress: () => cancelRide(),
        style: "cancel",
      },
      { text: "Accept", onPress: () => acceptRide() },
    ],
    { cancelable: false }
  );
};
