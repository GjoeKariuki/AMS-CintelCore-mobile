import { router } from "expo-router";
import { View, StyleSheet, Image, ImageBackground } from "react-native";
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
    // Delay the navigation to the next screen by 1 second (adjust the delay duration as needed)
    setTimeout(() => {
      router.push("/face");
    }, 1000); // Delay in milliseconds (1 second in this case)
  };

  const handleCheckOut = () => {
    playSoundAndVibrate();
    // Delay the navigation to the next screen by 1 second (adjust the delay duration as needed)
    setTimeout(() => {
      router.push("/checkout");
    }, 1000); // Delay in milliseconds (1 second in this case)
  };

  return (


    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Stack spacing={15}>
          <Text variant="h3" style={styles.welcome}>
            Welcome to:{" "}
          </Text>

          <Text variant="h2" style={styles.buildingName}>
            {buildingName}
          </Text>

          <View style={styles.actions}>
            <ThemedButton
              name="rick"
              backgroundColor="#08154A"
              type="primary"
              textSize={22}
              springRelease={true}
              height={56}
              onPress={handleCheckIn}
            >
              CHECK-IN
            </ThemedButton>
            <ThemedButton
              name="rick"
              textSize={22}
              height={56}
              onPress={handleCheckOut}
            >
              CHECK-OUT
            </ThemedButton>
          </View>
        </Stack>

        {/* <FAB icon={(props) => <Icon name="plus" {...props} />} /> */}

        {/* <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require("../../assets/illustration.jpg")}
          />
        </View> */}
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
  welcome: {
    color: "#566570",
    fontSize: 100,
    textAlign: "center",
    fontWeight: 700,
    lineHeight: 110,
    fontFamily: 'serif'
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
    justifyContent: "space-between",
    marginTop: 30,
    //gap: 100,
  },
  bc: {
    borderWidth: 2,
  },
  buildingName: {
    fontWeight: 700,
    fontSize: 72,
    color: "#08154A",
  },
  backgroundImg: {
    flex: 1,
    resizeMode: 'contain',
    marginTop: -514,
  },
  blurred: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
});
