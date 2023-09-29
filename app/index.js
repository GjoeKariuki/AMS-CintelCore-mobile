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
            <Button
              onPress={handleSubmit}
              title="Submit"
              style={styles.submitButton}
              titleStyle={{ fontSize: 18 }}
            />
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
