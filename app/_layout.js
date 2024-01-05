import { Slot } from "expo-router";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { UserProvider } from "../lib/contexts";
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import { ImageBackground, StyleSheet } from 'react-native'


export default function HomeLayout() {
  return (
    <>
      <UserProvider>
        <Header />
        <ImageBackground source={require('../assets/images/5968949.jpg')} style={styles.backgroundImg}>
        <Slot />
        </ImageBackground>        
        <HideWithKeyboard><Footer /></HideWithKeyboard>
        
      </UserProvider>
    </>
  );
}


const styles = StyleSheet.create({
  backgroundImg: {
    flex: 1,
    resizeMode: 'contain',
    marginTop: -514,
  }
})