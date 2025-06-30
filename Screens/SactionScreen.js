import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import CheckBox from '@react-native-community/checkbox';
import Head from './Header'; // Ensure Head component is defined or imported
import EncryptedStorage from 'react-native-encrypted-storage';
import publicIP from 'react-native-public-ip'; // Make sure this is installed
import HTTPRequest from '../utils/HTTPRequest';

const SactionScreen = ({ navigation, route }) => {
  const [loan, setLoan] = useState(route?.params?.sact || '');
  const [loans, setLoans] = useState(route?.params?.loanA || '');
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [user_id, setUser_id] = useState('');


  const fetchUrl = async () => {
    console.log(loan, 'loan')
    setLoading(true);
    try {
      const storedUserId = await EncryptedStorage.getItem('user_id');
      const userId = storedUserId ? JSON.parse(storedUserId)?.user_id : null;
      setUser_id(userId);
      const storedId = await EncryptedStorage.getItem('token');
      const token = storedId ? JSON.parse(storedId)?.token : null;
      setUrl('https://green.salarynow.in/salaryadmin/api_v21/Agreement/loanSaction/' + userId + '/' + loan + '/' + token);
    } catch (error) {
      console.error("Error fetching URL:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrl();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }


 const allow = async () => {
  try {
    setLoading(true);

    const ip = await publicIP();

    console.log('IP:', ip);
      const response = await HTTPRequest.checkSanction({
        ip: ip,
      });

      console.log('Response:', response.data);
      if (response.status === 200 && response.data.response_status == 1) {
        navigation.navigate(response.data.response_data.pagename, { loan });
    } else {
      Alert.alert('Error', 'Location data not available.');
    }
  } catch (error) {
    console.error('Permission error:', error);
    Alert.alert('Server Error', 'Something went wrong. Please try again later.');
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={styles.container}>
      <Head title="Loan Sanction Letter" />
      <View style={styles.container1}>
        {/* <Text>{loan}</Text> */}
        {url ? (
          <WebView source={{ uri: url }} />
        ) : (
          <Button title="Retry" onPress={fetchUrl} />
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.checkboxContainer}>
          <CheckBox value={isChecked} onValueChange={setIsChecked} />
          <Text style={styles.checkboxText}>I have read and accept the terms mentioned in the sanction Letter</Text>
        </View>

        <View style={styles.buttonContainer}>
          {isChecked == false ? (
            <TouchableOpacity
              style={styles.denyButton}
              onPress={() => navigation.navigate('Home')}>
              <Text style={styles.denyButtonText}>Cancel</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.denyButton1}>
              <Text style={styles.modalButtonText1}>Cancel</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.agreeButton, { backgroundColor: isChecked ? '#00A1E4' : '#DDD' }]}
            disabled={!isChecked}
             onPress={allow}>
            <Text style={styles.agreeButtonText}>I Agree</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container1: {
    flexGrow: 1, // Allow scrolling if content exceeds view height
    paddingHorizontal: 20,
    // paddingBottom: 10,
    marginTop: 15,
  },
  denyButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f44336',
    borderRadius: 5,
  },
  agreeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    marginRight: 10,
  },
  modalButtonText1: {
    color: '#ababab',
    fontSize: 16,
  },
  footer: {
    // flexGrow: 1, // Allow scrolling if content exceeds view height
    paddingHorizontal: 20,
    paddingBottom: 20,
    // marginTop: 15,
    // paddingHorizontal: 10,
    // paddingVertical: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,

  },
  checkboxText: {
    // marginLeft: 3,
    fontSize: 14,
    marginRight: 8,
    fontWeight: 'bold',
  },
  privacyPolicyLink: {
    fontSize: 14,
    color: '#00A1E4',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  denyButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  denyButton1: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e5e5e5',
    borderRadius: 5,
  },
  denyButtonText: {
    color: '#FFF',
  },
  agreeButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default SactionScreen;
