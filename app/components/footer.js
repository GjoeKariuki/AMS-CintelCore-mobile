import { StyleSheet, View } from "react-native";
import { Text } from "@react-native-material/core";

export const Footer = () => {
  return (
    <View style={styles.container}>
      <Text variant="h6" style={styles.powered}>
        Powered By :
        <Text variant="h6" style={styles.cintel}>
          Cintel<Text variant="h6">Core</Text>
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 40,
  },
  powered: {
    color: "red",
    paddingLeft: 50,
  },
  cintel: {
    color: "#010089",
  },
});
