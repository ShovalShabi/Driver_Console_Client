import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { List, Subheading, Divider } from "react-native-paper";
import { IStation } from "../utils/IStation";
import { RootState } from "../states/store";
import { useSelector } from "react-redux";

const StationsList: React.FC = () => {
  // Access stations from Redux store
  const stations: IStation[] | null = useSelector(
    (state: RootState) => state.ridePlanning.stationsResponseArr
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Subheading style={styles.subheading}>Stations</Subheading>
      <List.Section>
        {stations!.map((station, index) => (
          <React.Fragment key={index}>
            <List.Item
              title={station.data?.stationName || "Unknown Station"}
              description={`Station ${station.data?.stopOrder}`}
              style={styles.listItem}
              titleStyle={
                station.visited
                  ? styles.visitedText // Visited -> line-through text
                  : station.active
                  ? styles.text // Active -> black text
                  : styles.grayText // Not active -> grey text
              }
              descriptionStyle={
                station.visited
                  ? styles.visitedText // Visited -> line-through text
                  : station.active
                  ? styles.text // Active -> black text
                  : styles.grayText // Not active -> grey text
              }
              disabled={station.visited} // Disable the item if it's visited
            />
            {index < stations!.length - 1 && <Divider />}
            {/* Add Divider except after the last item */}
          </React.Fragment>
        ))}
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  subheading: {
    marginBottom: 8,
  },
  listItem: {
    marginBottom: 8,
  },
  text: {
    color: "black", // Active station -> black text
  },
  grayText: {
    color: "grey", // Inactive station -> grey text
  },
  visitedText: {
    color: "grey", // Visited station -> grey with line-through
    textDecorationLine: "line-through",
  },
});

export default StationsList;
