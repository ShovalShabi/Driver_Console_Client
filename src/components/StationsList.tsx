import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { List, Subheading } from "react-native-paper";

interface Station {
  name: string;
  visited: boolean;
}

interface StationsListProps {
  stations: Station[];
}

const StationsList: React.FC<StationsListProps> = ({ stations }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Subheading style={styles.subheading}>Bus Route</Subheading>
      <List.Section>
        {stations.map((station, index) => (
          <List.Item
            key={index}
            title={station.name}
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
  },
});

export default StationsList;
