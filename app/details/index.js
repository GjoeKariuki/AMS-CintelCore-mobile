import { router } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Field, Formik } from "formik";
import { Text } from "@react-native-material/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

import { useUser, useUserDispatch } from "../../lib/contexts/userContext";
import { CustomInput } from "../components/customInput";
import AwesomeButton from "react-native-really-awesome-button";


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

export default function FullName() {
  const { first_name, last_name } = useUser();
  const dispatch = useUserDispatch();

  function handleChangeName({ first_name, last_name }) {
    dispatch({ type: "SET_FIRST_NAME", payload: first_name });
    dispatch({ type: "SET_LAST_NAME", payload: last_name });
  }

  const _submit = async ({ first_name, last_name }) => {
    playSoundAndVibrate();
    handleChangeName({ first_name, last_name });

    // Save the input values in AsyncStorage
    try {
      await AsyncStorage.setItem("tempFirstName", first_name);
      await AsyncStorage.setItem("tempLastName", last_name);
      console.log("Values stored in AsyncStorage:", first_name, last_name);
    } catch (error) {
      console.error("Error saving input values:", error);
    }
    router.push("/details/id");
  };

  return (
    <View style={styles.container}>
      <View style={styles.InputFields}>
        <Formik initialValues={{ first_name, last_name }} onSubmit={_submit}>
          {({ handleSubmit, isValid }) => (
            <View style={styles.inputContainer}>
              <View style={styles.name}>
                <Text variant="h4">First Name</Text>
                <Field
                  component={CustomInput}
                  name="first_name"
                  label="First Name"
                  autoFocus
                  labelStyle={{ fontSize: 32 }} // add this line
                  style={styles.input}
                />
              </View>
              <View style={styles.name}>
                <Text variant="h4">Last Name</Text>
                <Field
                  component={CustomInput}
                  name="last_name"
                  label="Last Name"
                  style={styles.input}
                  labelStyle={{ fontSize: 32 }}
                />
              </View>
              <View style={styles.nextButton}>
                <AwesomeButton backgroundColor="#010089" onPress={handleSubmit} stretch textSize={20}>
                  Next
                </AwesomeButton>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  InputFields: {
    flex: 1,
    width: 800,
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    paddingTop: 20,
    gap: 40,
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
  nextButton: {
    width: 120,
    justifyContent: "center",
    marginTop: 56,
    marginLeft: 10,
  },
  name: {
    flexDirection: "column",
    gap: 10,
    width: 300,
  },
});
