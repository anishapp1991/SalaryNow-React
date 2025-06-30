
import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  BackHandler, 
  Alert, 
  StatusBar,
  Dimensions,
  ScrollView
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import HTTPRequest from '../utils/HTTPRequest';

const { width, height } = Dimensions.get('window');

const RejectedScreen = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchDatas();

      // Add back handler listener
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      return () => backHandler.remove(); // Cleanup listener when screen is unfocused
    }, [])
  );

  const fetchDatas = async () => {
    try {
      setLoading(true);
      const response = await HTTPRequest.personalDetails();
      if (response.status === 200) {
        const details = response.data.response_data;
        console.log(details, 'detailss');
        setData(details);
      } else {
        Alert.alert('Error', 'Failed to fetch personal details.');
      }
    } catch (error) {
      console.error('Error fetching personal details:', error);
      // Set empty data on error - no fallback text
      setData({
        delete_message: {}
      });
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </ScrollView>
    );
  }

  // Extract delete_message object - no fallback values, use only API response
  const deleteMessage = data.delete_message || {};
  const {
    screen_heading,
    resp_message,
    next_step_heading,
    next_p,
    help_heading,
    help_p
  } = deleteMessage;

  // Split the pipe-separated strings into arrays only if they exist
  const nextSteps = next_p ? next_p.split(' | ').filter(step => step.trim()) : [];
  const helpSteps = help_p ? help_p.split(' | ').filter(step => step.trim()) : [];

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true}
      bounces={true}
      keyboardShouldPersistTaps="handled"
    >
      {/* Status Icon */}
      <View style={styles.statusIconContainer}>
        <View style={styles.statusIcon}>
          <Text style={styles.statusIconText}>⚠️</Text>
        </View>
      </View>

      {/* Main Message */}
      {screen_heading && (
        <View style={styles.messageContainer}>
          <Text style={styles.title}>{screen_heading}</Text>
          
          {resp_message && (
            <View style={styles.messageBox}>
              <Text style={styles.message}>
                {resp_message}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Additional Info */}
      {next_step_heading && nextSteps.length > 0 && (
        <View style={styles.infoSection}>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>{next_step_heading}</Text>
            <Text style={styles.infoText}>
              {nextSteps.map((step, index) => (
                `• ${step.trim()}${index < nextSteps.length - 1 ? '\n' : ''}`
              )).join('')}
            </Text>
          </View>
        </View>
      )}

      {/* Contact Information */}
      {help_heading && helpSteps.length > 0 && (
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>{help_heading}</Text>
          <Text style={styles.contactText}>
            {helpSteps.map((step, index) => (
              `${step.trim()}${index < helpSteps.length - 1 ? '\n' : ''}`
            )).join('')}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  statusIconContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  statusIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff3cd',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffc107',
  },
  statusIconText: {
    fontSize: 32,
  },
  messageContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  messageBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    borderRightColor: '#ffc107',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2c3e50',
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 30,
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1565c0',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#1976d2',
  },
  contactSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 30,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },
  contactText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default RejectedScreen;