// import React, { useState, useEffect, useRef } from 'react';
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     StyleSheet,
//     Dimensions,
//     Alert,
//     ToastAndroid,
//     ScrollView,
//     KeyboardAvoidingView,
// } from 'react-native';
// import { useSmsUserConsent } from '@eabdullazyanov/react-native-sms-user-consent';
// import HTTPRequest from '../utils/HTTPRequest';
// import Head from './Header';

// const { width } = Dimensions.get('window');

// const LoanAgreement = ({ navigation, route }) => {
//     const [otp, setOtp] = useState(['', '', '', '', '', '']);
//     const [timer, setTimer] = useState(60);
//     const otpInputRefs = useRef([]);
//     const [loan, setLoan] = useState([]);
//     const retrievedCode = useSmsUserConsent();
//     const [mobile, setMobile] = useState('');

//     useEffect(() => {
//         const countdown = setInterval(() => {
//             setTimer((prev) => (prev > 0 ? prev - 1 : 0));
//         }, 1000);
//         fetchLoanData();
//         return () => clearInterval(countdown);
//     }, []);

//     const fetchLoanData = async () => {
//         try {
//             const response = await HTTPRequest.LoanOtp();
//             if (response.status === 200) {
//                 setLoan(response.data.response_data);
//                 sendOtp();
//             } else {
//                 // Alert.alert('Error', 'Failed to fetch personal details.');
//             }
//         } catch (error) {
//             console.error('Error fetching details:', error);
//         }
//     };

//     const sendOtp = async () => {
//         try {
//             const response = await HTTPRequest.sendOtp();
//             if (response.status === 200) {
//                 setMobile(response.data.response_data.mobile);
//             } else {
//                 // Alert.alert('Error', 'Failed to fetch personal details.');
//             }
//         } catch (error) {
//             console.error('Error fetching details:', error);
//         }
//     };

//     useEffect(() => {
//         if (retrievedCode) {
//             const codeArray = retrievedCode.split('').slice(0, 6);
//             setOtp(codeArray);
//             codeArray.forEach((digit, i) => {
//                 if (otpInputRefs.current[i]) {
//                     otpInputRefs.current[i].setNativeProps({ text: digit });
//                 }
//             });
//         }
//     }, [retrievedCode]);

//     useEffect(() => {
//         if (otp.every((digit) => digit !== '')) {
//             verifyOtp();
//         }
//     }, [otp]);

//     const handleOtpChange = (value, index) => {
//         const otpArray = [...otp];
//         otpArray[index] = value;
        
//         // Update the state
//         setOtp(otpArray);
      
//         console.log('Current OTP Array:', otpArray); // Logs the updated array
      
//         // Move to the next input if a value is entered
//         if (value && index < otp.length - 1) {
//           otpInputRefs.current[index + 1]?.focus();
//         }
      
//         // Auto-submit when all fields are filled
//         if (otpArray.every((digit) => digit !== '')) {
//           setTimeout(() => verifyOtp(otpArray), 0); // Pass the latest array
//         }
//       };
    
//       const handleKeyPress = (event, index) => {
//         if (event.nativeEvent.key === 'Backspace') {
//           const otpArray = [...otp];
      
//           // Clear the current field
//           otpArray[index] = '';
//           setOtp(otpArray);
      
//           // Move to the previous field immediately, if available
//           if (index > 0) {
//             otpInputRefs.current[index - 1]?.focus();
//             otpArray[index - 1] = ''; // Clear the previous field as well
//             setOtp(otpArray);
//           }
//         }
//       };
//       const verifyOtp = async (otpArray = otp) => {
//         const otpString = otpArray.join('');
      
//         console.log('Final OTP:', otpString); // Logs the correct final OTP
      
//         if (otpString.length !== 6) {
//           Alert.alert('Error', 'Please enter the complete 6-digit OTP.');
//           return;
//         }
//         try {
//             const res = await HTTPRequest.otpLoanVerify({
//                 mobile: mobile,
//                 otp: otpString,
//             });

//             if (res.status === 200) {
//                 // Alert.alert('Success', 'OTP verified successfully.');
//                 ToastAndroid.show( 'OTP verified successfully.', ToastAndroid.SHORT);

//                 navigation.navigate('MandateShow');
//             } else {
//                 Alert.alert('Error', 'OTP verification failed. Please try again.');
//             }
//         } catch (error) {
//             console.error(error);
//             Alert.alert('Error', 'Failed to process request. Please try again.');
//         }
//     };



//     const handleCall = async () =>{
//         try {
//             const response = await HTTPRequest.getCall();
//             if (response.status === 200) {
//                var sta =   response.data.response_status;
//              if (sta == 1){
//                 ToastAndroid.show(response.data.response_msg, ToastAndroid.SHORT);
//              }else{
//                 ToastAndroid.show(response.data.response_msg, ToastAndroid.SHORT);
//              }
//             } else {
//                 console.error('Error', 'Failed to fetch personal details.');
//             }
//         } catch (error) {
//             console.error('Error fetching details:', error);
//         }
//     }

//     return (
//         <KeyboardAvoidingView
//             style={{ flex: 1 }}
//             behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//         >
//             <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//                 <View style={styles.container}>
//                     <Head title="Loan Agreement" />
//                     <View style={styles.container1}>
//                         <Text style={styles.text}>Loan Details</Text>
//                         <View style={styles.detailsContainer}>
//                             {loan.map((item, index) => (
//                                 <View style={styles.detailRow} key={index}>
//                                     {item.key !== "Loan Short Status" && (
//                                         <>
//                                             <Text style={styles.label}>{item.key}</Text>
//                                             <Text
//                                                 style={item.key === "Loan Status" ? styles.value1 : styles.value}
//                                             >
//                                                 {item.val}
//                                             </Text>
//                                         </>
//                                     )}
//                                 </View>
//                             ))}
//                         </View>
//                         <View style={styles.inputContainer}>
//                             <Text style={styles.title}>By entering the OTP, you agree to the above</Text>
//                             <Text style={styles.subtitle}>An OTP has been sent to your registered mobile number</Text>

//                             <View style={styles.otpContainer}>
//                                 {otp.map((digit, index) => (
//                                     <TextInput
//                                         key={index}
//                                         style={styles.otpInput}
//                                         value={digit}
//                                         keyboardType="numeric"
//                                         maxLength={1}
//                                         ref={(el) => (otpInputRefs.current[index] = el)}
//                                         onChangeText={(value) => handleOtpChange(value, index)}
//                                         onKeyPress={(event) => handleKeyPress(event, index)}
//                                     />
//                                 ))}
//                             </View>

//                             {timer > 0 ? (
//                                 <Text style={styles.timerText}>Resend OTP in {timer}s</Text>
//                             ) : (
//                                 <TouchableOpacity onPress={handleCall}>
//                                     <Text style={styles.resendText}>OTP via Call</Text>
//                                 </TouchableOpacity>
//                             )}
//                         </View>
//                     </View>
//                 </View>
//             </ScrollView>
//         </KeyboardAvoidingView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F5F5F5',
//     },
//     text: {
//         textAlign: 'center',
//         marginBottom: 15,
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#000'
//     },
//     container1: {
//         flex: 1,
//         paddingHorizontal: 20,
//         marginTop: 15,
//         backgroundColor: '#F5F5F5',
//     },
//     detailsContainer: {
//         width: '100%',
//     },
//     value1: {
//         width: '50%', // Set width to control line break, adjust as needed
//         fontSize: 12,
//         textAlign: 'center',
//         color: '#000',
//         backgroundColor: '#F4A500',
//         padding: 5,
//         borderRadius: 15,
//         alignSelf: 'flex-start',
//         marginBottom: 10,
//       },
//     detailRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         width: '100%',
//         marginBottom: 15,
//     },
//     label: {
//         flex: 1,
//         textAlign: 'left',
//         fontWeight: 'bold',
//         fontSize: 14,
//         color: '#000',
//     },
//     value: {
//         flex: 1,
//         textAlign: 'right',
//         fontWeight: 'bold',
//         fontSize: 14,
//         color: '#000',
//     },
//     inputContainer: {
//         padding: 20,
//         borderRadius: 15,
//         width: width * 0.9,
//     },
//     title: {
//         fontSize: 15,
//         fontWeight: 'bold',
//         marginBottom: 10,
//         textAlign: 'center',
//         color: '#000'
//     },
//     subtitle: {
//         fontSize: 15,
//         marginBottom: 20,
//         color: '#777',
//         textAlign: 'center',
//     },
//     otpContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         width: '100%',
//         marginBottom: 20,
//     },
//     otpInput: {
//         flex: 1,
//         height: 50,
//         borderWidth: 1,
//         borderColor: '#ccc',
//         textAlign: 'center',
//         fontSize: 20,
//         borderRadius: 10,
//         marginHorizontal: 5,
//         backgroundColor: '#D2D2CF'
//     },
//     timerText: {
//         color: '#777',
//         textAlign: 'center',
//         marginBottom: 20,
//     },
//     resendText: {
//         color: '#00A8E8',
//         textAlign: 'center',
//         marginBottom: 20,
//     },
// });

// export default LoanAgreement;

// import React, { useState, useEffect, useRef } from 'react';
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     StyleSheet,
//     Dimensions,
//     Alert,
//     ToastAndroid,
//     ScrollView,
//     KeyboardAvoidingView,
// } from 'react-native';
// import { useSmsUserConsent } from '@eabdullazyanov/react-native-sms-user-consent';
// import HTTPRequest from '../utils/HTTPRequest';
// import Head from './Header';

// const { width } = Dimensions.get('window');

// const LoanAgreement = ({ navigation, route }) => {
//     const [otp, setOtp] = useState(['', '', '', '', '', '']);
//     const [timer, setTimer] = useState(60);
//     const otpInputRefs = useRef([]);
//     const [loan, setLoan] = useState([]);
//     const retrievedCode = useSmsUserConsent();
//     const [mobile, setMobile] = useState('');

//     useEffect(() => {
//         const countdown = setInterval(() => {
//             setTimer((prev) => (prev > 0 ? prev - 1 : 0));
//         }, 1000);
//         fetchLoanData();
//         return () => clearInterval(countdown);
//     }, []);

//     const fetchLoanData = async () => {
//         try {
//             const response = await HTTPRequest.LoanOtp();
//             if (response.status === 200) {
//                 setLoan(response.data.response_data);
//                 sendOtp();
//             }
//         } catch (error) {
//             console.error('Error fetching details:', error);
//         }
//     };

//     const sendOtp = async () => {
//         try {
//             const response = await HTTPRequest.sendOtp();
//             if (response.status === 200) {
//                 setMobile(response.data.response_data.mobile);
//             }
//         } catch (error) {
//             console.error('Error fetching details:', error);
//         }
//     };

//     useEffect(() => {
//         if (retrievedCode) {
//             const codeArray = retrievedCode.split('').slice(0, 6);
//             setOtp(codeArray);
//             codeArray.forEach((digit, i) => {
//                 if (otpInputRefs.current[i]) {
//                     otpInputRefs.current[i].setNativeProps({ text: digit });
//                 }
//             });
//         }
//     }, [retrievedCode]);

//     useEffect(() => {
//         if (otp.every((digit) => digit !== '')) {
//             verifyOtp();
//         }
//     }, [otp]);

//     const handleOtpChange = (value, index) => {
//         // Allow only numeric input (ignore special characters)
//         if (/[^0-9]/.test(value)) {
//             return; // Reject any non-numeric input
//         }

//         const otpArray = [...otp];
//         otpArray[index] = value;
//         setOtp(otpArray);

//         // Move to the next input if a value is entered
//         if (value && index < otp.length - 1) {
//             otpInputRefs.current[index + 1]?.focus();
//         }

//         // Auto-submit when all fields are filled
//         if (otpArray.every((digit) => digit !== '')) {
//             setTimeout(() => verifyOtp(otpArray), 0);
//         }
//     };

//     const handleKeyPress = (event, index) => {
//         if (event.nativeEvent.key === 'Backspace') {
//             const otpArray = [...otp];
//             // Clear the current field
//             otpArray[index] = '';
//             setOtp(otpArray);

//             // Move to the previous field if available
//             if (index > 0) {
//                 otpInputRefs.current[index - 1]?.focus();
//                 otpArray[index - 1] = ''; // Clear the previous field as well
//                 setOtp(otpArray);
//             }
//         }
//     };

//     const verifyOtp = async (otpArray = otp) => {
//         const otpString = otpArray.join('');
      
//         if (otpString.length !== 6) {
//             Alert.alert('Error', 'Please enter the complete 6-digit OTP.');
//             return;
//         }
//         try {
//             const res = await HTTPRequest.otpLoanVerify({
//                 mobile: mobile,
//                 otp: otpString,
//             });

//             if (res.status === 200) {
//                 ToastAndroid.show('OTP verified successfully.', ToastAndroid.SHORT);
//                 navigation.navigate('MandateShow');
//             } else {
//                 Alert.alert('Error', 'OTP verification failed. Please try again.');
//             }
//         } catch (error) {
//             console.error(error);
//             Alert.alert('Error', 'Failed to process request. Please try again.');
//         }
//     };

//     const handleCall = async () => {
//         try {
//             const response = await HTTPRequest.getCall();
//             if (response.status === 200) {
//                 var sta = response.data.response_status;
//                 if (sta == 1) {
//                     ToastAndroid.show(response.data.response_msg, ToastAndroid.SHORT);
//                 } else {
//                     ToastAndroid.show(response.data.response_msg, ToastAndroid.SHORT);
//                 }
//             } else {
//                 console.error('Error', 'Failed to fetch personal details.');
//             }
//         } catch (error) {
//             console.error('Error fetching details:', error);
//         }
//     };

//     return (
//         <KeyboardAvoidingView
//             style={{ flex: 1 }}
//             behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//         >
//             <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//                 <View style={styles.container}>
//                     <Head title="Loan Agreement" />
//                     <View style={styles.container1}>
//                         <Text style={styles.text}>Loan Details</Text>
//                         <View style={styles.detailsContainer}>
//                             {loan.map((item, index) => (
//                                 <View style={styles.detailRow} key={index}>
//                                     {item.key !== "Loan Short Status" && (
//                                         <>
//                                             <Text style={styles.label}>{item.key}</Text>
//                                             <Text
//                                                 style={item.key === "Loan Status" ? styles.value1 : styles.value}
//                                             >
//                                                 {item.val}
//                                             </Text>
//                                         </>
//                                     )}
//                                 </View>
//                             ))}
//                         </View>
//                         <View style={styles.inputContainer}>
//                             <Text style={styles.title}>By entering the OTP, you agree to the above</Text>
//                             <Text style={styles.subtitle}>An OTP has been sent to your registered mobile number</Text>

//                             <View style={styles.otpContainer}>
//                                 {otp.map((digit, index) => (
//                                     <TextInput
//                                         key={index}
//                                         style={styles.otpInput}
//                                         value={digit}
//                                         keyboardType="numeric"
//                                         maxLength={1}
//                                         ref={(el) => (otpInputRefs.current[index] = el)}
//                                         onChangeText={(value) => handleOtpChange(value, index)}
//                                         onKeyPress={(event) => handleKeyPress(event, index)}
//                                     />
//                                 ))}
//                             </View>

//                             {timer > 0 ? (
//                                 <Text style={styles.timerText}>Resend OTP in {timer}s</Text>
//                             ) : (
//                                 <TouchableOpacity onPress={handleCall}>
//                                     <Text style={styles.resendText}>OTP via Call</Text>
//                                 </TouchableOpacity>
//                             )}
//                         </View>
//                     </View>
//                 </View>
//             </ScrollView>
//         </KeyboardAvoidingView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F5F5F5',
//     },
//     text: {
//         textAlign: 'center',
//         marginBottom: 15,
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#000'
//     },
//     container1: {
//         flex: 1,
//         paddingHorizontal: 20,
//         marginTop: 15,
//         backgroundColor: '#F5F5F5',
//     },
//     detailsContainer: {
//         width: '100%',
//     },
//     value1: {
//         width: '50%',
//         fontSize: 12,
//         textAlign: 'center',
//         color: '#000',
//         backgroundColor: '#F4A500',
//         padding: 5,
//         borderRadius: 15,
//         alignSelf: 'flex-start',
//         marginBottom: 10,
//     },
//     detailRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         width: '100%',
//         marginBottom: 15,
//     },
//     label: {
//         flex: 1,
//         textAlign: 'left',
//         fontWeight: 'bold',
//         fontSize: 14,
//         color: '#000',
//     },
//     value: {
//         flex: 1,
//         textAlign: 'right',
//         fontWeight: 'bold',
//         fontSize: 14,
//         color: '#000',
//     },
//     inputContainer: {
//         padding: 20,
//         borderRadius: 15,
//         width: width * 0.9,
//     },
//     title: {
//         fontSize: 15,
//         fontWeight: 'bold',
//         marginBottom: 10,
//         textAlign: 'center',
//         color: '#000'
//     },
//     subtitle: {
//         fontSize: 15,
//         marginBottom: 20,
//         color: '#777',
//         textAlign: 'center',
//     },
//     otpContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         width: '100%',
//         marginBottom: 20,
//     },
//     otpInput: {
//         flex: 1,
//         height: 50,
//         borderWidth: 1,
//         borderColor: '#ccc',
//         textAlign: 'center',
//         fontSize: 20,
//         borderRadius: 10,
//         marginHorizontal: 5,
//         backgroundColor: '#D2D2CF'
//     },
//     timerText: {
//         color: '#777',
//         textAlign: 'center',
//         marginBottom: 20,
//     },
//     resendText: {
//         color: '#00A8E8',
//         textAlign: 'center',
//         marginBottom: 20,
//     },
// });

// export default LoanAgreement;


import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, ToastAndroid, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useSmsUserConsent } from '@eabdullazyanov/react-native-sms-user-consent';
import HTTPRequest from '../utils/HTTPRequest';
import Head from './Header';
import publicIP from 'react-native-public-ip';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';

const { width } = Dimensions.get('window');

const LoanAgreement = ({ navigation, route }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const otpInputRefs = useRef([]);
    const [loan, setLoan] = useState([]);
    const retrievedCode = useSmsUserConsent();
    const [mobile, setMobile] = useState('');
    const [location, setLocation] = useState(null);

    useEffect(() => {
        const checkLocationPermission = async () => {
            try {
                const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
                if (granted) {
                    await getCurrentLocation();
                } else {
                    await requestLocationPermission();
                }
            } catch (error) {
                console.error('Error checking location permission:', error);
            }
        };

        checkLocationPermission();
    }, []);

    useEffect(() => {
        const countdown = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        fetchLoanData();
        return () => clearInterval(countdown);
    }, []);

    const fetchLoanData = async () => {
        try {
            const response = await HTTPRequest.LoanOtp();
            if (response.status === 200) {
                setLoan(response.data.response_data);
                sendOtp();
            }
        } catch (error) {
            console.error('Error fetching loan data:', error);
        }
    };

 const getCurrentLocation = async () => {
    try {
      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Location set successfully:', { latitude, longitude });
          try {
            await EncryptedStorage.setItem('location', JSON.stringify({ latitude, longitude }));
            console.log('Location saved to EncryptedStorage:', { latitude, longitude });
          } catch (error) {
            console.error('Error saving location to EncryptedStorage:', error);
          }
          // Await the asynchronous `setLocation` call
          await setLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error fetching location:', error);
        },
        { enableHighAccuracy: false, timeout: 30000, maximumAge: 600000 }
      );
    } catch (err) {
      console.error('An unexpected error occurred:', err);
    }
  };

    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'This app requires location access to fetch your address.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                getCurrentLocation();
            } else {
                Alert.alert('Permission Denied', 'Location permission is required to fetch the address.');
            }
        } catch (error) {
            console.error('Error requesting location permission:', error);
        }
    };

    const sendOtp = async () => {
        try {
            const response = await HTTPRequest.sendOtp();
            if (response.status === 200) {
                setMobile(response.data.response_data.mobile);
            }
        } catch (error) {
            console.error('Error fetching OTP:', error);
        }
    };

    useEffect(() => {
        if (retrievedCode) {
            const codeArray = retrievedCode.split('').slice(0, 6);
            setOtp(codeArray);
            codeArray.forEach((digit, i) => {
                if (otpInputRefs.current[i]) {
                    otpInputRefs.current[i].setNativeProps({ text: digit });
                }
            });
        }
    }, [retrievedCode]);

    useEffect(() => {
        // Check if all digits are filled and trigger OTP verification
        if (otp.every((digit) => digit !== '')) {
            verifyOtp();
        }
    }, [otp]);  // Trigger verification when OTP state changes

    const handleOtpChange = (value, index) => {
        if (/[^0-9]/.test(value)) {
            return; // Reject non-numeric input
        }

        const otpArray = [...otp];
        otpArray[index] = value;
        setOtp(otpArray);

        // Move to the next input if a value is entered
        if (value && index < otp.length - 1) {
            otpInputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (event, index) => {
        if (event.nativeEvent.key === 'Backspace') {
            const otpArray = [...otp];
            otpArray[index] = ''; // Clear current field
            setOtp(otpArray);

            if (index > 0) {
                otpInputRefs.current[index - 1]?.focus();
            }
        }
    };

    const verifyOtp = async () => {
        const otpString = otp.join('');
        console.log('OTP Verification:', otpString);
        if (otpString.length !== 6) {
            Alert.alert('Error', 'Please enter the complete 6-digit OTP.');
            return;
        }

        try {
            const ip = await publicIP();
                    const locationString = await EncryptedStorage.getItem('location');
            
                    if (locationString !== null) {
                      // If the item exists, parse the JSON string into an object
                      const locations = JSON.parse(locationString);
            const latLng = location
                ? `${location.latitude}|${location.longitude}`
                : `${locations.latitude}|${locations.longitude}`; // Fallback if location is not available

            console.log('IP:', otpString);
            const res = await HTTPRequest.otpLoanVerify({
                mobile: mobile,
                otp: otpString,
                ip: ip,
                latlong: latLng,
            });

            if (res.status === 200 && res.data.response_status == 1) {
                ToastAndroid.show('OTP verified successfully.', ToastAndroid.SHORT);
                navigation.navigate(res.data.response_data.pagename);
            } else {
                Alert.alert('Error', res.data.response_msg);
            }
        }else{
            console.log('Error getting location from EncryptedStorage:', error);
        }
        } catch (error) {
            console.error('Error verifying OTP:', error);
        }
    };


    const handleCall = async () => {
        try {
            // Reset the timer to 60 seconds when requesting OTP via call
            setTimer(60);

            // Make API call to request OTP via call
            const response = await HTTPRequest.getCall();
            if (response.status === 200) {
                const sta = response.data.response_status;
                ToastAndroid.show(response.data.response_msg, ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error('Error requesting OTP call:', error);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>
                    <Head title="Loan Agreement" />
                    <View style={styles.container1}>
                        <Text style={styles.text}>Loan Details</Text>
                        <View style={styles.detailsContainer}>
                            {loan.map((item, index) => (
                                <View style={styles.detailRow} key={index}>
                                    {item.key !== "Loan Short Status" && (
                                        <>
                                            <Text style={styles.label}>{item.key}</Text>
                                            <Text style={item.key === "Loan Status" ? styles.value1 : styles.value}>
                                                {item.val}
                                            </Text>
                                        </>
                                    )}
                                </View>
                            ))}
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.title}>By entering the OTP, you agree to the above</Text>
                            <Text style={styles.subtitle}>An OTP has been sent to your registered mobile number</Text>

                            <View style={styles.otpContainer}>
                                {otp.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        style={styles.otpInput}
                                        value={digit}
                                        keyboardType="numeric"
                                        maxLength={1}
                                        ref={(el) => (otpInputRefs.current[index] = el)}
                                        onChangeText={(value) => handleOtpChange(value, index)}
                                        onKeyPress={(event) => handleKeyPress(event, index)}
                                    />
                                ))}
                            </View>

                            {timer > 0 ? (
                                <Text style={styles.timerText}>Resend OTP in {timer}s</Text>
                            ) : (
                                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                                    <TouchableOpacity onPress={handleCall}>
                                        <Text style={styles.resendText}>OTP via Call</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    text: {
        textAlign: 'center',
        marginBottom: 15,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    container1: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 15,
        backgroundColor: '#F5F5F5',
    },
    detailsContainer: {
        width: '100%',
    },
    value1: {
        width: '50%',
        fontSize: 12,
        textAlign: 'center',
        color: '#000',
        backgroundColor: '#F4A500',
        padding: 5,
        borderRadius: 15,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 15,
    },
    label: {
        flex: 1,
        textAlign: 'left',
        fontWeight: 'bold',
        fontSize: 14,
        color: '#000',
    },
    value: {
        flex: 1,
        textAlign: 'right',
        fontWeight: 'bold',
        fontSize: 14,
        color: '#000',
    },
    inputContainer: {
        padding: 20,
        borderRadius: 15,
        width: width * 0.9,
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#000',
    },
    subtitle: {
        fontSize: 15,
        marginBottom: 20,
        color: '#777',
        textAlign: 'center',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    otpInput: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        textAlign: 'center',
        fontSize: 20,
        borderRadius: 10,
        marginHorizontal: 5,
        backgroundColor: '#D2D2CF',
    },
    timerText: {
        color: '#777',
        textAlign: 'center',
        marginBottom: 20,
    },
    resendText: {
        color: '#00A8E8',
    },
});

export default LoanAgreement;