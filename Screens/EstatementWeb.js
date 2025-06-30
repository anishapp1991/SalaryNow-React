import React, { useRef, useState, useEffect } from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';
import DocumentPicker from 'react-native-document-picker';
import Head from './Header'; // Ensure Head component is defined or imported
import EncryptedStorage from 'react-native-encrypted-storage';
import HTTPRequest from '../utils/HTTPRequest';

const WebViewScreen = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [application_no, setApplication_no] = useState('');

  const webViewRef = useRef(null);

  // Fetch loan details (including application number)
  const loanDetails = async () => {
    try {
      setLoading(true);
      const response = await HTTPRequest.fetchLoanDetails();
      if (response.status === 200) {
var application = response.data.response_data.data.loan_details.application_no;
        console.log(application, 'jnnnnknkn');
        setApplication_no(application);
fetchUrl(application);
      } else {
        Alert.alert('Error', 'Failed to fetch loan details.');
      }
    } catch (error) {
      console.error('Error fetching loan details:', error);
      Alert.alert('Error', 'An error occurred while fetching loan details.');
    }
  };

  // Fetch the URL after the loan details are loaded
  const fetchUrl = async (application) => {
    try {
      const storedUserId = await EncryptedStorage.getItem('user_id');
      const userId = storedUserId ? JSON.parse(storedUserId)?.user_id : null;
        const storedId = await EncryptedStorage.getItem('token');
        const token = storedId ? JSON.parse(storedId)?.token : null;

      console.log(userId, application_no,token, 'nikiih');
      if (userId && application) {
        const constructedUrl = `https://green.salarynow.in/salaryadmin/AppBanking/show/${userId}/${application}/${token}`;
        setUrl(constructedUrl);
      } else {
        Alert.alert('Error', 'Failed to load user or loan information.');
      }
    } catch (error) {
      console.error("Error fetching URL:", error);
    } finally {
      setLoading(false);
    }
  };

  // Wait for loan details before fetching the URL
  useEffect(() => {
    const loadData = async () => {
      await loanDetails();  // Wait for loan details to be fetched
      // await fetchUrl();  // Fetch URL after loan details are set
    };

    loadData();  // Call the loadData function to fetch both details and URL
  }, [application_no]);  // Use application_no as a dependency

  // If loading is true, show the loading indicator
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Function to handle file selection
  const handleFileSelection = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // Allow all file types
      });

      const fileUri = result[0].uri;
      const fileName = result[0].name;
      const fileType = result[0].type;

      // Prepare the file data to send to the WebView
      const fileData = {
        uri: fileUri,
        name: fileName,
        type: fileType,
      };

      // Send the file data to the WebView
      webViewRef.current.postMessage(JSON.stringify(fileData));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Cancelled', 'File selection was cancelled.');
      } else {
        Alert.alert('Error', 'An error occurred while picking the file.');
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Head title="Bank Statement" />
      <View style={{ flex: 1 }}>
        <WebView
          ref={webViewRef}
          source={{ uri: url }} 
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowFileAccess={true}
          setSupportMultipleWindows={false} // Prevent new windows
          allowUniversalAccessFromFileURLs={true}
          onMessage={(event) => {
            if (event.nativeEvent.data === 'openFilePicker') {
              handleFileSelection();
            }
          }}
          onNavigationStateChange={(navState) => {
            if (navState.url.includes('aadharverifyexit')) {
              navigation.navigate('Home'); // Navigate to Home screen
            }
          }}
        />
      </View>
    </View>
  );
};

export default WebViewScreen;
