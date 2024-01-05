import React from "react";
import { StyleSheet, View, Image, ImageBackground } from "react-native";
import Svg, { Circle, Rect } from 'react-native-svg';
import {BlurView} from '@react-native-community/blur'

export const Header = () => {

  return (
    
    <ImageBackground source={require('../../assets/images/6843497.jpg')} style={styles.backgroundImg}>
    
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={[styles.image, ]}
          source={require("../../assets/true-final-ams.png")}
          resizeMode="contain"
        />
      </View>
    </View>
    
    </ImageBackground>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 50,
    alignItems: "right",
    
   
  },
  imageContainer: {  
    width: 176,
    height: 440,
    alignItems: "center",
    marginTop: -150,
    marginLeft: 50,

  },
  image: {
    flex: 1,
    aspectRatio: 1, // Maintain the aspect ratio of the image
  },
  backgroundImg: {
    //aspectRatio: 1,
    flex: 1,
    resizeMode: 'contain',
    height: 140,
    paddingTop: 10,
    
    
  }
});