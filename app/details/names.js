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
import axios from "axios";
import BackButton from "../components/backbtn";

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
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  

  function handleChangeName({ first_name, last_name }) {
    dispatch({ type: "SET_FIRST_NAME", payload: first_name });
    dispatch({ type: "SET_LAST_NAME", payload: last_name });
  }

  const postImage = async (id) => {
    try {
      const savedLocalUri = await AsyncStorage.getItem("localPhotoUri");
      const token = await AsyncStorage.getItem("token");
      if (!savedLocalUri) {
        console.log("No saved image URI found.");
        return;
      }

      let newForm = new FormData();
      newForm.append("image", {
        uri: savedLocalUri,
        name: "image.jpg",
        type: "image/jpg",
      });

      const newConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      };

      console.log(`Posting the image`);
      await axios.put(`https://staging--api.cintelcoreams.com` + `/visitor/${id}/`, newForm, newConfig);
      await AsyncStorage.removeItem("localPhotoUri");
    } catch (error) {
      console.log("Error posting image or retrieving saved URI: ", error);
    }
  };

  const _submit = async (values) => {
    const { first_name, last_name } = values;
    playSoundAndVibrate();
    handleChangeName({ first_name, last_name });

    try {
      const id = await AsyncStorage.getItem("tempID");
      const phoneNumber = await AsyncStorage.getItem("phoneNumber");
      const token = await AsyncStorage.getItem("token");

      const data = {
        first_name: first_name,
        last_name: last_name,
        id_number: id,
        phone_number: phoneNumber,
      };

      console.log("Data being sent:", data);

      const response = await axios.post(`https://staging--api.cintelcoreams.com` + "/visitor/", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      console.log("POST request successful:", response.data);
      AsyncStorage.setItem("visitorId", response.data.id.toString());

      // Post the image
      const image_id = await response.data.id;

      postImage(image_id);
    } catch (error) {
      console.log("Error making the POST request:", error);
      if (error.response) {
        console.log("Server Error Response Data:", error.response.data);
      }
    }

    
    router.push("/details/otp");
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
      <View >
    <BackButton />
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
    justifyContent: "center"
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
