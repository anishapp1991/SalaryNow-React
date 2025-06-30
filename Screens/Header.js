import React from 'react';
import { View, StyleSheet, StatusBar, Text, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
const { width, height } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';

const Head = ({ title }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <StatusBar hidden={false} backgroundColor="#419fb8" />
      <View style={styles.container}>
        {/* TouchableOpacity wrapping only the icon */}
        <TouchableOpacity
          onPress={() =>
            title === 'Mandate' || title === 'Loan Agreement Letter' || title === 'OTP based Verification' || title === 'Not Eligible' 
            || title === "CKYC Consent Agreement" || title === "Loan Sanction Letter"  || title === "Loan Agreement Letter"
            || title === 'Apply Loan' || title === 'Family Details' || title === 'Upload Bank Statement' || title === 'NetBanking' || title === 'Bank E-Statement' ||  title === 'Bank Statement' 
            ||  title === 'Loan Agreement' 
              ? navigation.navigate('Home') // Navigates to the Home screen
              // :  title === 'PAN Card' ||  title === 'Address Prof' ||  title === 'Salary Slip' 
              // ? navigation.navigate('AllDocuments')
              : navigation.goBack()
          }
        >
          <Ionicons name="chevron-back-outline" size={25} color="#fff" style={styles.icon} />
        </TouchableOpacity>
        {/* Title text is not wrapped in TouchableOpacity */}
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#419fb8',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center', // Centers content vertically
  },
  icon: {
    marginLeft: 10,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    // marginLeft:width/3.9
    // textAlign: 'center', // Ensures the text is centered
    // width: width,
  },
});

export default Head;
