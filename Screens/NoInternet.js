// NoInternet.js
import React,{useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, RefreshControl, ScrollView } from 'react-native';
import LottieView from 'lottie-react-native';
import NetInfo from '@react-native-community/netinfo';

const NoInternet = ({ navigation }) => {

const handleChange = () => {
  NetInfo.fetch().then(state => {
    if (state.isConnected) {
     navigation.goBack()
    }
  });
}
  return (

    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
       <LottieView
            source={require('../assests/lottie/No-internet2.json')} // Replace with your Lottie file path
            autoPlay
            loop
            style={styles.lottie}
          />
      <Text style={styles.text}>Seems like you don't have an active internet connection</Text>
      <TouchableOpacity style={styles.applyButton} onPress={handleChange}>
          <Text style={styles.applyButtonText}>Retry</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  lottie: {
    width: 350,
    height: 350,
    marginBottom: 20,
  },
  text:{
    fontSize: 16,
    textAlign:'center',
    fontWeight:'bold',
    color:'#419fb8'
  },
  applyButton: {
    backgroundColor: '#419fb8',
    paddingHorizontal:15,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  applyButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
});
export default NoInternet;
