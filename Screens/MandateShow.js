// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, ActivityIndicator, Button, Alert } from 'react-native';
// import { WebView } from 'react-native-webview';
// import Head from './Header';
// import EncryptedStorage from 'react-native-encrypted-storage';
// // import CookieManager from '@react-native-cookies/cookies';
// import { Linking } from 'react-native';

// const MandateShow = ({ navigation }) => {
//   const [loading, setLoading] = useState(false);
//   const [url, setUrl] = useState('');

//   const fetchUrl = async () => {
//     setLoading(true);
//     try {
//       const storedUserId = await EncryptedStorage.getItem('user_id');
//       const userId = storedUserId ? JSON.parse(storedUserId)?.user_id : null;
//       const storedLoan = await EncryptedStorage.getItem('dashboardloan');
//       const userLoan = storedLoan ? JSON.parse(storedLoan)?.dashboardloan : null;
//       const applicationNo = userLoan?.response_data?.data?.loan_details?.application_no;
//       if (userId && applicationNo) {
//         // setUrl(`https://green.salarynow.in/salaryadmin/api_v21/Mandate/show/${userId}/${applicationNo}`);
//       } else {
//         Alert.alert('Error', 'Failed to load user or loan information.');
//       }
//     } catch (error) {
//       console.error("Error fetching URL:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Clear cookies to avoid session issues
//     // CookieManager.clearAll().then(() => console.log('Cookies cleared.'));
//     fetchUrl();
//   }, []);

//   const handleNavigation = (event) => {
//     if (!event.url.startsWith('https://green.salarynow.in')) {
//       Linking.openURL(event.url).catch(() => {
//         Alert.alert('Error', 'Unable to open link.');
//       });
//       return false;
//     }
//     return true;
//   };

//   if (loading) {
//     return <ActivityIndicator size="large" color="#0000ff" />;
//   }

//   return (
//     <View style={styles.container}>
//       <Head title="Mandate" />
//       <View style={styles.container1}>
//         {url ? (
//           <WebView
//             source={{ uri: url, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }}
//             javaScriptEnabled={true}
//             domStorageEnabled={true}
//             mixedContentMode="always"
//             thirdPartyCookiesEnabled={true}
//             javaScriptCanOpenWindowsAutomatically={true}
//             setSupportMultipleWindows={true}
//             useWebKit={true}
//             originWhitelist={['*']}
//             onNavigationStateChange={handleNavigation}
//             onHttpError={(syntheticEvent) => {
//               const { nativeEvent } = syntheticEvent;
//               console.error("HTTP Error:", nativeEvent);
//             }}
//             onError={(syntheticEvent) => {
//               const { nativeEvent } = syntheticEvent;
//               console.error("WebView Error:", nativeEvent);
//             }}
//             injectedJavaScriptBeforeContentLoaded={`
//               (function() {
//                 window.open = function(url) {
//                   window.ReactNativeWebView.postMessage(url);
//                 };
//               })();
//             `}
//             onMessage={(event) => {
//               const targetUrl = event.nativeEvent.data;
//               if (targetUrl) {
//                 Linking.openURL(targetUrl).catch(() => {
//                   Alert.alert('Error', 'Unable to open popup link.');
//                 });
//               }
//             }}
//           />
//         ) : (
//           <Button title="Retry" onPress={fetchUrl} />
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F9FA',
//   },
//   container1: {
//     flexGrow: 1,
//   },
// });

// export default MandateShow;


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Button, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import Head from './Header'; // Ensure Head component is defined or imported
import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { closeApp } from './AppExit';


const MandateShow = ({ navigation }) => {
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
      const applicationNo = userLoan?.response_data?.data?.loan_details?.application_no;
      if (userId && applicationNo) {
        const constructedUrl = `https://green.salarynow.in/salaryadmin/api_v21/Mandate/show/${userId}/${applicationNo}/${token}`;
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


  useEffect(() => {
    fetchUrl();
    const handleBackPress = () => {
      // Show a confirmation alert if desired
      Alert.alert(
        "Exit App",
        "Are you sure you want to close the app?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Exit", onPress: () => closeApp() },
        ]
      );
      return true; // Prevent default back button behavior
    };

    // Add event listener for back button
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    // Cleanup the event listener
    return () => {
      backHandler.remove();
    };
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Head title="Mandate" />
      <View style={styles.container1}>
        {url ? (
          <WebView source={{ uri: url }} />
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

export default MandateShow;

