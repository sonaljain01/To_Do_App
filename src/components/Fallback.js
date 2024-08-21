import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

const Fallback = () => {
  return (
    <View style={styles.container}>
      <Image source={require("../../assets/to_do.jpeg")} style={styles.image}/>
      <Text>Start Adding your task</Text>
    </View>
  )
}

export default Fallback

const styles = StyleSheet.create({
    container:{
        alignItems: "center",
    },
    image:{
        height: 300,
        width: 300,
    }
})