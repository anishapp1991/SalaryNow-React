import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import EncryptedStorage from 'react-native-encrypted-storage';
import Head from './Header';

const Netbanking = () => {
  const [webviewUrl, setWebviewUrl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserId = await EncryptedStorage.getItem('user_id');
        const userId = storedUserId ? JSON.parse(storedUserId)?.user_id : null;
        const storedLoan = await EncryptedStorage.getItem('dashboardloan');
        const userLoan = storedLoan ? JSON.parse(storedLoan)?.dashboardloan : null;
        const storedId = await EncryptedStorage.getItem('token');
        const token = storedId ? JSON.parse(storedId)?.token : null;
        console.log(userId, 'userId')
        if (userId && userLoan) {
          const applicationNo = userLoan.response_data.data.loan_details.application_no;
          console.log(applicationNo, 'application')
          const url = `https://green.salarynow.in/salaryadmin/api_v21/StatementNetBanking/NetBanking/${userId}/${applicationNo}/${token}`;
          setWebviewUrl(url);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Head title="NetBanking" />
      <View style={styles.container1}>
        {webviewUrl ? (
          <WebView
            source={{ uri: webviewUrl }}
            style={{ flex: 1 }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            setSupportMultipleWindows={false} // Prevent new windows
          />
        ) : (
          <View style={styles.loadingContainer}>
            <Text>Loading...</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  container1: {
    flexGrow: 1,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Netbanking;
