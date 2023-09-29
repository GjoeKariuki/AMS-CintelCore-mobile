import { router } from "expo-router";
import { Field, Formik } from "formik";
import { ScrollView, StyleSheet, View } from "react-native";
import {  Text } from "@react-native-material/core";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { CustomInput } from "../components/customInput";
import { useUser, useUserDispatch } from "../../lib/contexts/userContext";

import AwesomeButton from "react-native-really-awesome-button";

export default function Id() {
  const { id_number } = useUser();
  const dispatch = useUserDispatch();

  function handleChangeId(id_number) {
    dispatch({ type: "SET_ID_NUMBER", payload: id_number });
  }

  const _submit = async ({ id_number }) => {
    handleChangeId(id_number);

    // Save the input Value in AsyncStorage
    try {
      await AsyncStorage.setItem("tempID", id_number);

      console.log("ID Number Stored: ", id_number);
    } catch (error) {
      console.log("Error saving input value");
    }
    router.push("/details/telephone");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.main}>
        <View style={styles.content}>
          <Formik initialValues={{ id_number }} onSubmit={_submit}>
            {({ handleSubmit, isValid }) => (
              <View style={styles.inputContainer}>
                <View style={styles.id}>
                  <Text variant="h4">ID Number</Text>
                  <Field
                    component={CustomInput}
                    name="id_number"
                    label="ID Number"
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
  id: {
    width: 300,
    gap: 10,
  },
});
