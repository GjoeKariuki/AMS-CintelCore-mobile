import React from "react";
import { StyleSheet, View, Image } from "react-native";
import Svg, { Circle, Rect } from 'react-native-svg';


export const Header = () => {

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={[styles.image, ]}
          source={require("../../assets/true-final-ams.png")}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 70,
    alignItems: "center",
    
   
  },
  imageContainer: {  
    width: 176,
    height: 440,
    alignItems: "center",
    marginTop: -120,
    marginLeft: 50,
    
  },
  image: {
    flex: 1,
    aspectRatio: 1, // Maintain the aspect ratio of the image
  },
});