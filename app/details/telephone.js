import { router } from "expo-router";
import { Field, Formik } from "formik";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "@react-native-material/core";
import AsyncStorage from "@react-native-async-storage/async-storage";


import { CustomInput } from "../components/customInput";
import { useUser, useUserDispatch } from "../../lib/contexts/userContext";
import AwesomeButton from "react-native-really-awesome-button";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
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

export default function Id() {
  const { phone_number } = useUser();
  const dispatch = useUserDispatch();
  const apiUrr = process.env.EXPO_PUBLIC_API_URL;
  const apiUrl = `${apiUrr}`
  

  function handleChangeId(phone_number) {
    dispatch({ type: "SET_PHONE_NUMBER", payload: phone_number });
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

  const _submit = async ({ phone_number }) => {
    playSoundAndVibrate();
    const formattedPhoneNumber = `254${phone_number.slice(1)}`;
    handleChangeId(formattedPhoneNumber);

    await AsyncStorage.setItem("phoneNumber", formattedPhoneNumber);

    // Save the input values in AsyncStorage
    try {
      // Retrieve values from AsyncStorage
      const storedPhoneNumber = await AsyncStorage.getItem("phoneNumber");
      const storedId = await AsyncStorage.getItem("tempID");
      const token = await AsyncStorage.getItem("token");

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      };

      const response = await axios.get(`https://staging--api.cintelcoreams.com/visitor/?id_number=${storedId}&phone_number=${storedPhoneNumber}`, config);

      console.log("Response from API:", response.data);

      if (response.data && response.data.length === 0) {
        router.push("/details/names"); // Proceed to details/names if the response is an empty list
      } else {
        // Update the image field (assuming you're updating the image in AsyncStorage)
        const visitorId = response.data.id;
        postImage(visitorId);
  
        router.push("/floor"); // Proceed to floor after updating the image
      }
      
      console.log("Values stored in AsyncStorage:", formattedPhoneNumber);
    } catch (error) {
      console.error("Error saving input values:", error);
      console.error("Error fetching data from the API:", error.response?.data || error.message);
    }

    router.push("/details/names");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.main}>
        <View style={styles.content}>
          <Formik initialValues={{ phone_number }} onSubmit={_submit}>
            {({ handleSubmit, isValid }) => (
              <View style={styles.inputContainer}>
                <View style={styles.phone}>
                  <Text variant="h4">Telephone Number</Text>
                  <Field
                    component={CustomInput}
                    name="phone_number"
                    label="Telephone Number"
                    keyboardType="numeric"
                    autoFocus
                    style={styles.input}
                  />
                </View>

                <View style={styles.nextButton}>
                  <AwesomeButton
                    backgroundColor="#010089"
                    onPress={handleSubmit}
                    stretch
                    textSize={20}
                  >
                    Next
                  </AwesomeButton>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </View>
      <View >
    <BackButton />
  </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 76,
    alignItems: "center",
  },
  main: {
    flex: 1,
    flexDirection: "row",
    gap: 120,
    width: 800,
  },
  content: {
    flex: 1,
    paddingTop: 130,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
  outlinedBtn: {
    borderColor: "#010089",
    borderRadius: 100,
    borderWidth: 2,
    color: "#010089",
    fontSize: 20,
  },
  nextButton: {
    width: 120,
    height: 55,
    justifyContent: "center",
    marginTop: 41,
    marginLeft: 20,
  },
  phone: {
    width: 300,
    gap: 10,
  },
});
