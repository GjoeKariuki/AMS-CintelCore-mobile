import { router } from "expo-router";
import { View, StyleSheet, Image } from "react-native";
import { Text, Stack, Button } from "@react-native-material/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedButton } from "react-native-really-awesome-button";

import { useEffect, useState } from "react";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";

async function playSoundAndVibrate() {
  const sound = new Audio.Sound();

  try {
    console.log("Loading Sound");
    await sound.loadAsync(require("../../assets/sounds/arp-03-83545.mp3"));
    await sound.playAsync();

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.didJustFinish) {
        // The sound has finished playing, unload it
        await sound.unloadAsync();
      }
    });
  } catch (error) {
    // Handle errors here
    console.error("Error:", error);
  }
}

export default function Welcome() {
  const [buildingName, setBuildingName] = useState("");

  useEffect(() => {
    // Fetch the buildingName from AsyncStorage or any other storage mechanism.
    // For example, you can replace 'your_storage_key' with your actual key.
    AsyncStorage.getItem("buildingName")
      .then((value) => {
        if (value) {
          console.log("Fetched buildingName from storage:", value);

          setBuildingName(value);
        } else {
          console.log("buildingName not found in storage.");
        }
      })
      .catch((error) => {
        console.error("Error fetching buildingName from storage:", error);
      });
  }, []);

  console.log("buildingName", buildingName);

  const handleCheckIn = () => {
    playSoundAndVibrate();
    router.push("/face");
  };

  const handleCheckOut = () => {
    playSoundAndVibrate();
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Stack spacing={15}>
          <Text variant="h3">Welcome To : </Text>

          <Text variant="h2" style={styles.buildingName}>
            {buildingName}
          </Text>

          <View style={styles.actions}>
            <ThemedButton
              name="rick"
              backgroundColor="#010089"
              backgroundDarker="#CFDEE9"
              textColor="#FFFFFF"
              textSize={22}
              height={56}
              onPress={handleCheckIn}
            >
              CHECK-IN
            </ThemedButton>
            <ThemedButton
              name="rick"
              backgroundDarker="#010089"
              textSize={22}
              height={56}
              onPress={handleCheckOut}
            >
              CHECK-OUT
            </ThemedButton>
          </View>
        </Stack>

        {/* <FAB icon={(props) => <Icon name="plus" {...props} />} /> */}

        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require("../../assets/illustration.jpg")}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    paddingLeft: 60,
    alignItems: "center",
    flexDirection: "row",
  },

  checkInButton: {
    justifyContent: "center",

    backgroundColor: "#010089",
    width: 265,
    height: 56,
  },
  checkOutButton: {
    justifyContent: "center",
    width: 265,
    height: 56,
  },
  imageContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  image: {
    objectFit: "contain",
    width: 700,
  },
  subtitle: {
    fontSize: 50,
    fontWeight: 900,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    gap: 20,
  },
  bc: {
    borderWidth: 2,
  },
  buildingName: {
    fontWeight: 700,
    fontSize: 72,
    color: "#010089",
  },
});
