import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Image } from 'react-native';
import Head from './Header';
import LottieView from 'lottie-react-native';
import { positionStyle } from 'react-native-flash-message';
const Loan = () => {
const [loading,setLoading]= useState(true);

const handleEmailPress = () => {
  setLoading(false)
    const url = 'mailto:hello@salarynow.in';   
    Linking.openURL(url).catch((err) => console.error('Failed to open email:', err));

}

  return (
    <View style={styles.container1}>
      <Head title="Contact Us" />
      <View style={styles.container}>
      <Image
        source={require('../assests/logo.png')} // Replace with your logo path
        style={styles.logo}
      />

      {/* Text */}
      <Text style={styles.instructionText}>
        If you feel, there has been an issue, in scrutinizing your application, please contact us at:{' '}
        <Text>
          <TouchableOpacity onPress={handleEmailPress}>
            <Text style={styles.emailText}>hello@salarynow.in</Text>
          </TouchableOpacity>
        </Text>
      </Text>
      <TouchableOpacity onPress={handleEmailPress}>
       <LottieView
                        source={require('../assests/lottie/gmail-icon.json')}
                        autoPlay
                        loop
                        style={styles.chatIcon}
                    />
                    </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: '10%', 
    padding:8
  },
  container1: {
    flex: 1,
    backgroundColor: '#fff',

  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  instructionText: {
    fontSize: 15,
    textAlign: 'left',
    color: '#333',
    // lineHeight: 3,
  },
  emailText: {
    fontSize: 16,
    color: '#E76F51',
    textDecorationLine: 'underline',
    // marginTop:18,
    // position:'absolute',
  },
  chatIcon:{
    height:80,
    width:70,
    marginLeft:'85%',
  }
});

export default Loan;
