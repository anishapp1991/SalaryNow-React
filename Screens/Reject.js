import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Image, BackHandler, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import HTTPRequest from '../utils/HTTPRequest';
const RejectedScreen = () => {
  const [data, setData] = useState({});
  const [titles, setTitles] = useState('');
  const [texts, setTexts] = useState('');
  const [reply, setReply] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchDashboard();

      // Add back handler listener
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      return () => backHandler.remove(); // Cleanup listener when screen is unfocused
    }, [])
  );

  const fetchDashboard = async () => {
    try {
      const response = await HTTPRequest.fetchLoanDetails();
      if (response.status === 200) {
        var ds = response.data;
        var loans = ds.response_data.data;
        setData(loans);
        var daa = loans.reject_msg;
        const parts = daa.split('@');
        console.log(daa, 'loans')
        setTitles(parts[0]);
        setTexts(parts[1]);
        setReply(parts[2]);
      } else {
        Alert.alert('Error', 'Failed to fetch loan details.');
      }
    } catch (error) {
      console.error('Error fetching loan details:', error);
      // Alert.alert('Error', 'An error occurred while fetching loan details.');
    }
  };

  const handleBackPress = () => {
    // Exit the app on back press
    Alert.alert(
      "Exit App",
      "Are you sure you want to exit the app?",
      [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "Yes", onPress: () => BackHandler.exitApp() }
      ]
    );
    return true; // Prevent default behavior of going back
  };

  return (
    <View style={styles.container}>
      {/* Top Message */}
      <Image
        source={require('../assests/error.png')}
        style={styles.icon}
      />
      <Text style={styles.title}>{titles}</Text>
      <Text style={styles.message}>
        {texts}
      </Text>
      <Text style={styles.reapplyText}>{reply}</Text>

      {/* Calendar Image with Overlay */}
      <View style={styles.calendarContainer}>
        <Image
          source={require('../assests/calendar-new.png')} // Replace with your calendar image
          style={styles.calendarImage}
        />
        <Text style={styles.daysText}>{data.reject_days}</Text>
        <Text style={styles.daysLabel}>Days</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    width: 100,
    height: 100,
    marginTop: '30%',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    color: '#ccc',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  reapplyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#419fb8',
    marginBottom: 40,
    fontWeight: 'bold',
  },
  calendarContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  calendarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  daysText: {
    position: 'absolute',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
  },
  daysLabel: {
    position: 'absolute',
    bottom: 25,
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
});

export default RejectedScreen;
