import { StyleSheet, View } from "react-native";
import { Text } from "@react-native-material/core";

export const Footer = () => {
  return (
    <View style={styles.container}>
      <Text variant="h6" style={styles.powered}>
        Powered By:</Text>
        <View style={styles.checked}>
        <Text variant="h6" style={styles.cintel}>
          Cintel<Text variant="h6" style={styles.core}>Core</Text>
        </Text>
        </View>
       
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 10,
    position: 'absolute',
    width: '100%',
    bottom: 0,
    right: -535
    
  },
  powered: {
    color: "#900603",
    // paddingLeft: 50,
    fontSize: 22,  
    flexShrink: 1,
    fontFamily: 'monospace',
    alignSelf: "center"
  },
  cintel: {
    color: "white",
    fontSize: 30,
    fontWeight: 900,
    letterSpacing: 5,
    fontFamily: 'sans-serif-thin',
    backgroundColor: '#003364',
    lineHeight: 47,
    paddingLeft: 8,   
  },
  core: {
    color: 'white',
    fontSize: 30,  
    fontWeight: 900,
    letterSpacing: 4,
    backgroundColor: '#900603',
    fontFamily: 'sans-serif-thin',
    lineHeight: 47,
    paddingRight: 10,
    paddingLeft: 10   
  },
  innertxt: {
    color: 'white',
    fontSize: 22,  
  },
  checked: {
    padding: 2,
    
  }
});
