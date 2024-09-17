// src/components/StationsList.tsx
import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { List, Subheading } from "react-native-paper";
import { IStation } from "../utils/IStation";

interface StationsListProps {
  stations: IStation[];
}

const StationsList: React.FC<StationsListProps> = ({ stations }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Subheading style={styles.subheading}>Stations</Subheading>
      <List.Section>
        {stations.map((station, index) => (
          <List.Item
            key={index}
            title={`Station ${index + 1}`}
            description={station.address}
            style={styles.listItem}
            titleStyle={station.visited ? styles.visitedText : styles.text}
            disabled={station.visited}
          />
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
    color: "black",
  },
  visitedText: {
    color: "grey",
    textDecorationLine: "line-through",
  },
});

export default StationsList;
