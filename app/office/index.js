import { router } from "expo-router";
import { ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import { Text, Button } from "@react-native-material/core";
import { useUserDispatch } from "../../lib/contexts";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import AwesomeButton from "react-native-really-awesome-button";

export default function office() {
  const dispatch = useUserDispatch();
  const [floorId, setFloorId] = useState("");
  const [offices, setOffices] = useState([]);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    AsyncStorage.getItem("selectedFloorId").then((value) => {
      if (value) {
        console.log("Fetched floorId: ", value);
        const parseFloorId = parseInt(value, 10);
        setFloorId(parseFloorId);
        fetchOffices(parseFloorId);
      }
    });
  }, []);

  const fetchOffices = async (floorId) => {
    try {
      const response = await axios.get(
        apiUrl + `/office/?floor=${floorId}`
      );
      console.log("Office Response: ", response.data);

      // Extract floor numbers with associated IDs
      const officeData = response.data.map((officeData) => ({
        id: officeData.id,
        office_name: officeData.office_name,
      }));

      setOffices(officeData);
    } catch (error) {
      console.error("Error fetching offices:", error);
    }
  };

  const selectoffice = (office) => {
    console.log("Office Id", office.id);
    dispatch({ type: "SET_office", payload: office });
  };

  const _onPress = (office) => {
    selectoffice(office);

    // Fetch buildingId, visitorId, and other data from AsyncStorage
    AsyncStorage.multiGet(["buildingId", "visitorId", "selectedFloorId"])
      .then((values) => {
        const buildingId = values[0][1].toString(); // Convert to string
        const visitorId = values[1][1].toString(); // Convert to string
        const floorId = values[2][1].toString(); // Convert to string

        // Create the payload with the required data
        const payload = {
          visitor_id: visitorId,
          building_id: buildingId,
          floor_id: floorId,
          office_id: office.id.toString(), // Convert to string
        };

        // Make a POST request to your backend server
        axios
          .post(apiUrl + "/visit/", payload)
          .then((response) => {
            // Handle the response as needed
            console.log("POST Response: ", response.data);
            router.push("/final");
          })
          .catch((error) => {
            console.error("Error making POST request:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching data from AsyncStorage:", error);
      });
  };

  const renderofficeButtons = () => {
    const rows = Math.ceil(offices.length / 3); // Calculate the number of rows needed

    const officeButtons = [];
    let officeIndex = 0;

    for (let i = 0; i < rows; i++) {
      const row = [];

      for (let j = 0; j < 4; j++) {
        // Change the loop condition to j < 3
        if (officeIndex < offices.length) {
          const office = offices[officeIndex];
          row.push(
            <View style={styles.officeButton} key={`office-${office.id}`}>
              <AwesomeButton
                backgroundColor="#010089"
                onPress={() => _onPress(office)}
                stretch
                borderRadius={50}
                key={`button-${office.id}`}
                textSize={20}
              >
                {office.office_name}
              </AwesomeButton>
            </View>
          );
          officeIndex++;
        }
      }

      officeButtons.push(
        <View key={i} style={styles.row}>
          {row}
        </View>
      );
    }

    return officeButtons;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.main}>
        <Text variant="h4" style={styles.title}>
          Select Office
        </Text>
        <View style={styles.content}>{renderofficeButtons()}</View>
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
    alignItems: "center",
    marginTop: 140,
  },
  content: {
    width: 600
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    textAlign: "center",
    color: "#010089",
    paddingBottom: 40,
  },
  officeButton: {
    width: 120,
    justifyContent: "center",
    marginTop: 36,
    marginLeft: 10,
  }
});
