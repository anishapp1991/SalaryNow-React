import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import Head from './Header'; // Ensure Head component is defined or imported
import EncryptedStorage from 'react-native-encrypted-storage';

const Payment = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [user_id, setUser_id] = useState('');
  const [userLoans, setUserLoans] = useState({});


  const fetchUrl = async () => {

    setLoading(true);
    try {
      const storedUserId = await EncryptedStorage.getItem('user_id');
      const userId = storedUserId ? JSON.parse(storedUserId)?.user_id : null;
      const storedLoan = await EncryptedStorage.getItem('dashboardloan');
      const userLoan = storedLoan ? JSON.parse(storedLoan)?.dashboardloan : null;
      const storedId = await EncryptedStorage.getItem('token');
      const token = storedId ? JSON.parse(storedId)?.token : null;
      console.log(userLoan.response_data.data.agreement, 'userLoan');
      var str = userLoan.response_data.data.loan_details.application_no;
      console.log(str)
      setUser_id(userId);
      setUrl('https://green.salarynow.in/salaryadmin/api_v21/Payment/show/' + userId + '/' + str + '/' + token)
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

  return (
    <View style={styles.container}>
      <Head title="Repayment" />
      <View style={styles.container1}>
        {url ? (
          <WebView source={{ uri: url }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            setSupportMultipleWindows={false} // Prevent new windows
          />
        ) : (
          <Button title="Retry" onPress={fetchUrl} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container1: {
    flexGrow: 1, // Allow scrolling if content exceeds view height
    // paddingHorizontal: 20,
    // paddingBottom: 10,
    // marginTop: 15,
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
    paddingHorizontal: 20,
    paddingBottom: 20,
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

export default Payment;
