import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { auth } from '../firebase';
import { Dimensions } from 'react-native';


const win = Dimensions.get('window');

const Profile = ({navigationw}) =>{
    return(
        <View style={styles.container} >
            <Text style = {styles.text}>Email пользователя: {auth.currentUser.email}</Text>
            <Text style = {styles.text}>Имя пользователя: {auth.currentUser.displayName}</Text>
            <Text style = {styles.text}>Количество сообщений: </Text>
            <Image source={{
                uri: auth.currentUser.photoURL,
             }}
                style = {{width: 500, height: 500}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 10,
        backgroundColor: 'grey',
    },
    stretch: {
      width: 50,
      height: 200,
      resizeMode: 'stretch',
    },
    text:{
        fontSize:20
     }
  });

  export default Profile;