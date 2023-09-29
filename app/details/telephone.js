import { router } from "expo-router";
import { Field, Formik } from "formik";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "@react-native-material/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { CustomInput } from "../components/customInput";
import { useUser, useUserDispatch } from "../../lib/contexts/userContext";
import AwesomeButton from "react-native-really-awesome-button";

export default function Id() {
  const { phone_number } = useUser();
  const dispatch = useUserDispatch();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  function handleChangeId(phone_number) {
    dispatch({ type: "SET_PHONE_NUMBER", payload: phone_number });
  }

  const postImage = async (id) => {
    try {
      const savedLocalUri = await AsyncStorage.getItem("localPhotoUri");
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
        },
      };

      console.log(`Posting the image`);
      await axios.put(apiUrl + `/visitor/${id}/`, newForm, newConfig);
      await AsyncStorage.removeItem("localPhotoUri");
    } catch (error) {
      console.log("Error posting image or retrieving saved URI: ", error);
    }
  };

  const _submit = async ({ phone_number }) => {
    const formattedPhoneNumber = `254${phone_number.slice(1)}`;
    handleChangeId(formattedPhoneNumber);

    try {
      const firstName = await AsyncStorage.getItem("tempFirstName");
      const lastName = await AsyncStorage.getItem("tempLastName");
      const id = await AsyncStorage.getItem("tempID");

      const data = {
        first_name: firstName,
        last_name: lastName,
        id_number: id,
        phone_number: formattedPhoneNumber,
      };

      console.log("Data being sent:", data);

      const response = await axios.post(apiUrl + "/visitor/", data, {
        headers: {
          "Content-Type": "application/json",
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