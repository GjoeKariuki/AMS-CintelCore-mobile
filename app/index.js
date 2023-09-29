import { useState } from "react";
import { router } from "expo-router";
import { View, StyleSheet } from "react-native";
import {
  Button,
  Stack,
  TextInput,
  IconButton,
} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import axios from "axios";
import { Formik } from "formik";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AwesomeButton from "react-native-really-awesome-button";
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';



async function playSoundAndVibrate() {
  const sound = new Audio.Sound();

  try {
    console.log('Loading Sound');
    await sound.loadAsync(require('../assets/sounds/arp-03-83545.mp3'));
    await sound.playAsync();

    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    );
    
    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.didJustFinish) {
        // The sound has finished playing, unload it
        await sound.unloadAsync();
      }
    });
  } catch (error) {
    // Handle errors here
    console.error('Error:', error);
  }
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const toggleSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const handleLogin = async ({ email, password }) => {
    try {
      playSoundAndVibrate();
      console.log("Email: ", email);
      console.log("Password: ", password);
      const data = {
        username: email,
        password: password,
      };

      const response = await axios.post(
        apiUrl+"/login/",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      await AsyncStorage.setItem(
        "buildingId",
        response.data.user.building.id.toString()
      );
      await AsyncStorage.setItem(
        "buildingName",
        response.data.user.building.building_name
      );

      console.log(response.data.user.building.building_name);
      console.log(response.data.user.building.id);
      router.push("/welcome");
      //   const response = await axios.post('https://example.com/login', {
      //     email,
      //     password,
      //   });

      // Handle the response here (e.g., store authentication token, navigate to another screen)
      //   console.log(response.data);
    } catch (error) {
      // Handle error here (e.g., display error message)

      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View style={styles.formData}>
            <TextInput
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              label="Email"
              variant="outlined"
              trailing={(props) => (
                <IconButton
                  icon={(props) => <Icon name="email" {...props} />}
                  {...props}
                />
              )}
            />
            <TextInput
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              label="Password"
              variant="outlined"
              secureTextEntry={secureTextEntry}
              trailing={(props) => (
                <IconButton
                  icon={(props) => <Icon name="eye" {...props} />}
                  {...props}
                  onPress={toggleSecureTextEntry}
                />
              )}
            />
  
            <AwesomeButton backgroundColor="#010089" onPress={handleSubmit} stretch borderRadius={50}>SUBMIT</AwesomeButton>
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formData: {
    width: 500,
    gap: 30,
  },
  submitButton: {
    height: 56,
    justifyContent: "center",
  },
});
