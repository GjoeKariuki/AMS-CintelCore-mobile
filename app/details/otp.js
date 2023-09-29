import { router } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { Text } from "@react-native-material/core";
import axios from "axios"; // Import Axios
import AsyncStorage from "@react-native-async-storage/async-storage";
import AwesomeButton from "react-native-really-awesome-button";

const CELL_COUNT = 6;

export default function Details() {
  const [value, setValue] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
    }, 1000);

    // Clear the timer when the component unmounts
    return () => clearTimeout(timerId);
  }, [seconds]);

  const submitOTP = async () => {
    // Log the value of OTP entered by the user
    console.log("Entered OTP:", value);

    setIsLoading(true);

    console.log("Submitting OTP...");


    try {
      const id = await AsyncStorage.getItem("tempID");

      // Combine the data into a single object
      const data = {
        id_number: id,
        otp: value,
      };

      console.log("Data being sent:", data);

      // Make the POST request to the backend server
      const response = await axios.post(apiUrl + "/verify-visitor-otp/", data, {
        headers: {
          "Content-Type": "application/json", // specify the content type
        },
      });

      console.log("Response:", response.status);

      if (response.status === 200) {
        // Verification succeeded, navigate to a different screen
        router.push("/final");
      } else {
        setErrorMessage(true);
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      setErrorMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    const id = await AsyncStorage.getItem("tempID");
    setSeconds(30);
    setValue("");
    const data = {
      id_number: id,
    };

    const response = await axios.post(apiUrl + "/resend-visitor-otp/", data, {
      headers: {
        "Content-Type": "application/json", // specify the content type
      },
    });
  };

  const onDismissSnackBar = () => setErrorMessage(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.main}>
        <View style={styles.content}>
          <Text style={styles.title} variant="h3">
            Enter OTP
          </Text>
          <CodeField
            autoFocus
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFiledRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            editable={!isLoading}
            renderCell={({ index, symbol, isFocused }) => (
              <View
                onLayout={getCellOnLayoutHandler(index)}
                key={index}
                style={[styles.cellRoot, isFocused && styles.focusCell]}
              >
                <Text style={styles.cellText}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              </View>
            )}
          />
          <View
            style={{
              flexDirection: "row",
              marginTop: 28,
              justifyContent: "center",
              gap: 24,
              height: 48,
              alignItems: "center",
            }}
          >
            <View style={styles.otpButton}>
              <AwesomeButton
                onPress={resendOTP}
                stretch
                textSize={20}
                type="secondary"
              >
                Resend OTP
              </AwesomeButton>
            </View>
            <View style={styles.otpButton}>
              <AwesomeButton
                backgroundColor="#010089"
                onPress={submitOTP}
                stretch
                textSize={20}
              >
                Next
              </AwesomeButton>
            </View>

            <Text variant="bodySmall">
              {moment(seconds * 1000).format("mm:ss")}
            </Text>
          </View>
        </View>
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
    flexDirection: "row",
    gap: 120,
    marginTop: 130,
  },
  content: {
    flex: 1,
  },
  title: { textAlign: "center", fontSize: 30, color: "#007AFF" },
  codeFiledRoot: {
    marginTop: 20,
    width: 580,
    marginLeft: "auto",
    marginRight: "auto",
  },
  cellRoot: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  cellText: {
    color: "#000",
    fontSize: 36,
    textAlign: "center",
  },
  focusCell: {
    borderBottomColor: "#007AFF",
    borderBottomWidth: 2,
  },
  otpButton: {
    width: 150,
    height: 50,
    justifyContent: "center",
  },
});