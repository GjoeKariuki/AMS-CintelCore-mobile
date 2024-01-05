import React from "react";
import { useNavigation} from '@react-navigation/native';
import {  StyleSheet, Pressable } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';




export default function BackButton({text='Back'}){
    const navigation = useNavigation();
    const handlePress = () => {
        navigation.goBack();
    }
    return (
        <Pressable onPress={handlePress} style={styles.button}>
            
            <Icon name="arrow-back" size={30} color="white" text="back" />

        </Pressable>
    )
}


const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        paddingVertical: 12,
        paddingHorizontal: 22,
        marginBottom: 20,
        borderRadius: 4,
        elevation: 30,
        backgroundColor: '#900603',
        position: 'relative',
        right: -550,
        top: -550
        //bottom: 200
    },
})
