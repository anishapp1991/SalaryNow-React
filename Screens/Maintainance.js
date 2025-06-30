import React, { useState, useEffect, createContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, BackHandler, Alert } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import HTTPRequest from '../utils/HTTPRequest';
import { closeApp } from './AppExit';

export const MaintenanceContext = createContext();

const MaintenanceProvider = ({ children }) => {
  const [isUnderMaintenance, setIsUnderMaintenance] = useState(false);
  const [maintenanceData, setMaintenanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); // Access navigation

  // Function to fetch maintenance status
  const checkMaintenanceStatus = async () => {
    try {
      const response = await HTTPRequest.CheckMaintainance();
      if (response.status === 200 && response.data) {
        const data = response.data;
        setIsUnderMaintenance(data.response_data == false);
        setMaintenanceData(data);
      }
    } catch (error) {
      console.error('Error fetching maintenance status:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    // Fetch maintenance status on initial mount
    checkMaintenanceStatus();

    // Listen for navigation events to recheck maintenance status
    const unsubscribe = navigation.addListener('state', () => {
      checkMaintenanceStatus();
    });

    // Cleanup listener on unmount
    return unsubscribe;
  }, [navigation]);


  useEffect(() => {
    const handleBackPress = () => {
      if (isUnderMaintenance) {
        Alert.alert(
          "Are You Sure.",
    
          "You Want To Close The app.",
          [
            {
              text: 'OK',
              onPress: () => closeApp(),
              style: 'cancel',
            },
          ]
        );
      }
      return true; // Prevent default back behavior
    };

    // Add event listener for back press
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Cleanup event listener on unmount
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [isUnderMaintenance]);

  if (loading) {
    // Show loading screen while fetching maintenance status
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
             <ActivityIndicator size="large" color="#419FB8" />
           </View>
    );
  }

  if (isUnderMaintenance && maintenanceData) {
    const isImage = maintenanceData.type == 'image';
    const contentFile = maintenanceData.file;

    return (
      <View style={styles.container}>
        {contentFile ? (
          isImage ? (
            <Image source={{ uri: contentFile }} style={styles.animation} />
          ) : (
            <LottieView
              source={{ uri: contentFile }}
              autoPlay
              loop
              style={styles.animation}
            />
          )
        ) : (
          <Text style={styles.errorText}>No content available</Text>
        )}
        <Text style={[styles.messageText, { color: maintenanceData.color }]}>
          {maintenanceData.response_msg || 'The app is under maintenance.'}
        </Text>
      </View>
    );
  }

  return (
    <MaintenanceContext.Provider value={{ isUnderMaintenance }}>
      {children}
    </MaintenanceContext.Provider>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  animation: {
    width: 300,
    height: 300,
  },
  messageText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
  },
});

export default MaintenanceProvider;
