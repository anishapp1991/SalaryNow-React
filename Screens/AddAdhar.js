// import React, { useState, useContext } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ToastAndroid, ActivityIndicator } from 'react-native';
// import { useDispatch } from 'react-redux';
// import { loginSuccess } from '../Redux/Action';
// import AuthContext from '../ContextApi/AuthContext';
// import EncryptedStorage from 'react-native-encrypted-storage';
// import HTTPRequest from '../utils/HTTPRequest';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import FloatingPlaceholderInput from './FloatingPlaceholderInput';
// import FlashMessage, { showMessage } from 'react-native-flash-message';


// const AadhaarScreen = ({ navigation, route }) => {
//     const [aadhaarNumber, setAadhaarNumber] = useState('');
//     const [loading, setLoading] = useState(false);
//     const dispatch = useDispatch()
//     const { login } = useContext(AuthContext);
//     const [pages, setPages] = useState(route?.params?.page || '');
//     // Function to handle Aadhaar number submission
//     const handleSubmit = async () => {
//         if (aadhaarNumber.length === 12 && /^\d+$/.test(aadhaarNumber)) {
//             try {
//                 setLoading(true);
//                 console.log(aadhaarNumber,pages)
//                 const res = await HTTPRequest.adharVerify({
//                     aadhaar_number: aadhaarNumber,
//                     pagename: pages,
//                 });
//                 if (res.status === 200) {

//                     var rts = res.data;
//                     console.log(rts,'vbvbn')
//                     var ss = rts.response_data.data;

//                     if (rts.response_status == 1) {
//                         // setLoading(false);
//                         showMessage({
//                             message: rts.response_msg, // Success message
//                             type: "success", // Message type
//                             backgroundColor: '#419fb8', // Custom background color
//                             position:'bottom',
//                             duration: 2000, // Duration of the message
//                           });
//                         // ToastAndroid.show(rts.response_msg, ToastAndroid.SHORT);
//                         navigation.navigate('AdharVerify', { client: ss.client_id , pages:pages});
//                     } else {
//                         Alert.alert('Error', rts.response_msg);
//                     }
//                 } else {
//                     console.log('Error occurred:', res);
//                     // Alert.alert('Error', res);
//                 }
//             } catch (error) {
//                 console.error(error);
//                 // Alert.alert('Error', 'Failed to process request. Please try again.');
//             }finally{
//                 setLoading(false);
//             }
//         } else {
//             Alert.alert('Error', 'Please enter a valid 12-digit Aadhaar number');
//         }
//     };


//     const handleSkip = async () => {
//         const accessToken1 = await EncryptedStorage.getItem('token');
//         const parsedToken1 = JSON.parse(accessToken1);
//         const appId1 = parsedToken1?.token;
//         console.log(appId1, 'token')
//         dispatch(loginSuccess(appId1));
//         await login(appId1)
//     };

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#419FB8" />
//         <Text style={styles.loadingText}>Loading...</Text>
//       </View>
//     );
//   }

//     return (
//         <View style={styles.container}>
//             {pages && pages == 'DASHBOARD' ?
//                 <TouchableOpacity style={styles.skipButton1} onPress={() => navigation.goBack()}>
//                     <Ionicons name="close" size={25} color="#000" />
//                 </TouchableOpacity>
//                 :
//                 <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
//                     <Text style={styles.skipButtonText}>Skip</Text>
//                 </TouchableOpacity>
//             }

//             <Image source={require('../assests/adhar.png')} style={styles.chatIcon} />
//             <Text style={styles.title}>Enter Your Aadhaar Number</Text>
//             <FloatingPlaceholderInput
//                 // style={styles.input}
//                 placeholder="Aadhaar Number"
//                 keyboardType="numeric"
//                 maxLength={12}
//                 value={aadhaarNumber}
//                 onChangeText={setAadhaarNumber}
//                 placeholderTextColor="#999"
//             />
//             <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//                 <Text style={styles.buttonText}>Submit</Text>
//             </TouchableOpacity>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         paddingHorizontal: 20,
//         backgroundColor: '#fff',
//     },
//     title: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         marginBottom: 20,
//         textAlign: 'center',
//         color: '#000',
//     },
//     chatIcon: {
//         // flex:5,
//         width: 100,
//         height: 100,
//         marginBottom: 20,
//         marginHorizontal: '35%'

//     },
//     input: {
//         borderWidth: 1,
//         borderColor: '#ddd',
//         padding: 10,
//         borderRadius: 5,
//         fontSize: 14,
//         backgroundColor: '#fff',
//         color: '#000',
//     },
//     button: {
//         marginTop: 20,
//         backgroundColor: '#419fb8',
//         padding: 15,
//         borderRadius: 5,
//         alignItems: 'center',
//     },
//     buttonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     skipButton: {
//         position: 'absolute',
//         top: 20,
//         right: 20,
//         backgroundColor: 'transparent', // Transparent background
//         borderWidth: 1, // Border thickness
//         borderColor: '#419fb8', // Border color
//         paddingVertical: 6,
//         paddingHorizontal: 12,
//         borderRadius: 20, // Rounded corners
//     },
//     skipButton1: {
//         position: 'absolute',
//         top: 20,
//         right: 20,
//         backgroundColor: 'transparent', // Transparent background
//         // borderWidth: 2, // Border thickness
//         // borderColor: '#419fb8', // Border color
//         paddingVertical: 6,
//         paddingHorizontal: 12,
//         borderRadius: 20, // Rounded corners
//     },
//     skipButtonText: {
//         color: '#419fb8',
//         fontWeight: 'bold',
//         fontSize: 14,
//     },
// });

// export default AadhaarScreen;


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


// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Button } from 'react-native';
// import { WebView } from 'react-native-webview';
// import Head from './Header'; // Ensure Head component is defined or imported
// import EncryptedStorage from 'react-native-encrypted-storage';
// import { useDispatch } from 'react-redux';
// import { loginSuccess } from '../Redux/Action';
// import AuthContext from '../ContextApi/AuthContext';


// const AadhaarScreen = ({ navigation }) => {
//   const [loading, setLoading] = useState(false);
//   const [url, setUrl] = useState('');
//       const dispatch = useDispatch()
//     const { login } = useContext(AuthContext);
//     const [pages, setPages] = useState(route?.params?.page || '');


//   const fetchUrl = async () => {

//     setLoading(true);
//     try {
//       const storedUserId = await EncryptedStorage.getItem('user_id');
//       const userId = storedUserId ? JSON.parse(storedUserId)?.user_id : null;
//       if (userId) {
//         const constructedUrl = `https://green.salarynow.in/salaryadmin/api_v21/Aadhaar/show/${userId}`;
//         setUrl(constructedUrl);
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
//     fetchUrl();
//   }, []);

//   if (loading) {
//     return <ActivityIndicator size="large" color="#0000ff" />;
//   }

//   return (
//     <View style={styles.container}>
//       <Head title="Aadhar Verify" />
//       <View style={styles.container1}>
//         {url ? (
//           <WebView source={{ uri: url }} />
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
//     flexGrow: 1, // Allow scrolling if content exceeds view height
//     // paddingHorizontal: 20,
//     // paddingBottom: 10,
//     // marginTop: 15,
//   },
//   denyButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     backgroundColor: '#f44336',
//     borderRadius: 5,
//   },
//   agreeButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     backgroundColor: '#4CAF50',
//     borderRadius: 5,
//     marginRight: 10,
//   },
//   modalButtonText1: {
//     color: '#ababab',
//     fontSize: 16,
//   },
//   footer: {
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//     paddingVertical: 10,

//   },
//   checkboxText: {
//     // marginLeft: 3,
//     fontSize: 14,
//     marginRight:8,
//     fontWeight:'bold',
//   },
//   privacyPolicyLink: {
//     fontSize: 14,
//     color: '#00A1E4',
//     textDecorationLine: 'underline',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   denyButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   denyButton1: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     backgroundColor: '#e5e5e5',
//     borderRadius: 5,
//   },
//   denyButtonText: {
//     color: '#FFF',
//   },
//   agreeButtonText: {
//     color: '#FFF',
//     fontSize: 16,
//   },
// });

// export default AadhaarScreen;

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import Head from './Header'; // Ensure Head component is defined or imported
import EncryptedStorage from 'react-native-encrypted-storage';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../Redux/Action';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AuthContext from '../ContextApi/AuthContext';

const AadhaarScreen = ({ navigation, route }) => {
    const [loading, setLoading] = useState(false);
    const [url, setUrl] = useState('');
    const dispatch = useDispatch();
    const { login } = useContext(AuthContext);
    const [pages, setPages] = useState(route?.params?.page || '');

    // Fetch URL based on user_id
    const fetchUrl = async () => {
        setLoading(true);
        try {
            const storedUserId = await EncryptedStorage.getItem('user_id');
            const userId = storedUserId ? JSON.parse(storedUserId)?.user_id : null;
            const storedId = await EncryptedStorage.getItem('token');
            const token = storedId ? JSON.parse(storedId)?.token : null;
            if (userId) {
                const constructedUrl = `https://green.salarynow.in/salaryadmin/api_v21/Aadhaar/show/${userId}/${token}`;
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

    // Handle navigation to a different screen when URL changes
    const handleNavigationChange = async (navState) => {
        // Check if the URL has changed and if it's the URL you're looking for
        const newUrl = navState.url;

        // Example condition to check the URL and navigate to a new screen
        if (newUrl.includes('aadharverifyexit')) {
            // Navigate to a different screen
            //   navigation.navigate('AnotherScreen'); // Replace 'AnotherScreen' with your target screen

            if (pages === 'DASHBOARD') {
                navigation.navigate('Home');
            } else {
                const accessToken1 = await EncryptedStorage.getItem('token');
                const parsedToken1 = JSON.parse(accessToken1);
                const appId1 = parsedToken1?.token;
                // setLoading(false);
                dispatch(loginSuccess(appId1));
                await login(appId1);
            }

        }
    };

    // Fetch URL when component mounts
    useEffect(() => {
        fetchUrl();
    }, []);

    const handleSkip = async () => {
        const accessToken1 = await EncryptedStorage.getItem('token');
        const parsedToken1 = JSON.parse(accessToken1);
        const appId1 = parsedToken1?.token;
        console.log(appId1, 'token')
        dispatch(loginSuccess(appId1));
        await login(appId1)
    };

    // If loading, show a loading spinner
    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <Head title="Aadhaar Verify" />
            <View style={styles.container1}>

                {pages && pages == 'DASHBOARD' ?
                    <TouchableOpacity style={styles.skipButton1} onPress={() => navigation.goBack()}>
                        <Ionicons name="close" size={25} color="#000" />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                        <Text style={styles.skipButtonText}>Skip</Text>
                    </TouchableOpacity>
                }
                {url ? (
                    <WebView
                        source={{ uri: url }}
                        onNavigationStateChange={handleNavigationChange} // Handle navigation change
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
        flexGrow: 1,
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
    skipButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'transparent', // Transparent background
        borderWidth: 1, // Border thickness
        borderColor: '#419fb8', // Border color
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20, // Rounded corners
    },
    skipButton1: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'transparent', // Transparent background
        // borderWidth: 2, // Border thickness
        // borderColor: '#419fb8', // Border color
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20, // Rounded corners
    },
    skipButtonText: {
        color: '#419fb8',
        fontWeight: 'bold',
        fontSize: 14,
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

export default AadhaarScreen;