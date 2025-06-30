import React, { useState, useEffect, createContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { useNavigation } from '@react-navigation/native';

export const NetworkContext = createContext();

const NetworkProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(null); 
  const navigation = useNavigation();

  useEffect(() => {
    // Initialize the connection state
    const initializeConnection = async () => {
      const initialState = await NetInfo.fetch();
      setIsConnected(initialState.isConnected);
    };

    initializeConnection();

    const unsubscribe = NetInfo.addEventListener(state => {
      if (isConnected !== null) {
        if (state.isConnected === false && isConnected === true) {
          // Navigate to NoInternet page when connection is lost
          navigation.navigate('NoInternet');
        } else if (state.isConnected === true && isConnected === false) {
          // Show flash message when connection is restored
          showMessage({
            message: "Connected to the internet",
            type: "success",
            icon: "auto",
          });
        }
      }
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, [isConnected, navigation]);

  if (isConnected === null) {
    // Still checking the network connection
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
             <ActivityIndicator size="large" color="#419FB8" />
           </View>
    );
  }

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
      <FlashMessage position="top" />
    </NetworkContext.Provider>
  );
};

export default NetworkProvider;
