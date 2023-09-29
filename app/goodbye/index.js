import { router } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, Stack } from "@react-native-material/core";

import { useUser, useUserDispatch } from "../../lib/contexts";
import * as Speech from "expo-speech";

export default function Goodbye() {
  const { first_name, last_name } = useUser();
  const dispatch = useUserDispatch();
  const goodbyeSpeech =
    first_name + last_name + "Thank you for visiting";
  const fullName = first_name + " " + last_name;

  useEffect(() => {
    Speech.speak(goodbyeSpeech); // Speak the welcome speech immediately when the component mounts

    const timer = setTimeout(() => {
      dispatch({ type: "RESET" });
      router.push("/welcome");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.main}>
        <Text variant="h3" style={styles.name}>
          {fullName.toUpperCase()}
        </Text>
        <Text variant="h4" style={styles.title}>
          THANK YOU FOR VISITING
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 48,
  },
  title: {
    color: "#010089",
    fontWeight: 500,
  },
  name: {
    fontWeight: "bold",
    color: "#010089",
  },
  info: {
    color: "#010089",
  },
});
