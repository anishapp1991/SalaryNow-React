// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
// import LottieView from 'lottie-react-native'; // Lottie for animations
// import HttpRequest from '../utils/HTTPRequest';
// import FlashMessage, { showMessage } from 'react-native-flash-message';

// const Signup = ({ navigation }) => {
//     const [mobileNumber, setMobileNumber] = useState('');
//     const [error, setError] = useState('');

//     const handleVerifyNumber = async () => {
//         if (mobileNumber.length < 10) {
//             setError("Mobile number must be exactly 10 digits");
//         } else {
//             setError('');
//             // console.log('Mobile Number: ', mobileNumber);
//             try {
//                 const res = await HttpRequest.login({
//                     mobile: mobileNumber
//                 });

//                 if (res.status === 200) {
//                     //   console.log(res.data);
//                     showMessage({
//                         message: "OTP sent to your  Mobile Number!", // Success message
//                         type: "success", // Message type
//                         backgroundColor: '#419fb8', // Custom background color
//                         position:'bottom',
//                         duration: 2000, // Duration of the message
//                       });
//                     navigation.navigate('History', { mobileNumber });
//                 } else {
//                     console.log('Error occurred:', res);
//                 }
//             } catch (error) {
//                 console.error(error);
//                 Alert.alert('Error', 'Failed to process request. Please try again.');
//             }
//         }
//     };

//     const handleMobileNumberChange = (text) => {
//         const numericText = text.replace(/[^0-9]/g, '');
//         if (numericText === '') {
//             setError('');
//         }
//         else if (numericText.length === 1 && !['6', '7', '8', '9'].includes(numericText[0])) {
//             setError("Mobile number must start with a digit between 6 and 9");
//         }
//         else if (numericText.length >= 1 && ['6', '7', '8', '9'].includes(numericText[0])) {
//             if (numericText.length < 10) {
//                 setError("Mobile number must be exactly 10 digits");
//             } else {
//                 setError('');
//             }
//         }

//         setMobileNumber(numericText);
//     };

//     return (
//         <View style={styles.container}>
//              {/* <FlashMessage position="bottom"  style={{marginBottom:50}}/>  */}
//             {/* Logo and App Name */}
//             <View style={styles.logoContainer}>
//                 <Image source={require('../assests/logo.png')} style={styles.logo} />
//             </View>

//             {/* Welcome and Mobile Number Input */}
//             <View style={styles.inputContainer}>
//                 <Text style={styles.welcomeText}>Welcome!</Text>
//                 <Text style={styles.loginText}>Login To Continue</Text>

//                 <TextInput
//                     style={styles.input}
//                     placeholder="Enter Your Mobile No."
//                     value={mobileNumber}
//                     onChangeText={handleMobileNumberChange}
//                     keyboardType="numeric"
//                     maxLength={10} // Mobile number usually has 10 digits
//                 />

//                 {error ? <Text style={styles.errorText}>{error}</Text> : null}

//                 {/* Verify Button */}
//                 <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyNumber}>
//                     <Text style={styles.verifyButtonText}>Verify Number</Text>
//                 </TouchableOpacity>
//             </View>
           
//             {/* Bottom Section with Chat Icon and Info */}
//             <View style={styles.bottomContainer}>
//                 <TouchableOpacity style={styles.chatContainer} onPress={() => navigation.navigate('Contact Us')}>

//                     <Text style={styles.chatText}>Hello!</Text>
//                     <Image source={require('../assests/support-icon.png')} style={styles.chatIcon} />

//                 </TouchableOpacity>

//                 <Text style={styles.infoText}>
//                     We process our loans through RBI Licenced NBFC's Zed Leafin Pvt Ltd & Finkurve Financial Services Limited.
//                 </Text>
//             </View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f5f5f5',
//         paddingHorizontal: 20,
//     },
//     logoContainer: {
//         alignItems: 'center',
//         marginTop: 5,
//     },
//     logo: {
//         width: 180,
//         height: 180,
//         resizeMode: 'contain',
//     },
//     inputContainer: {
//         backgroundColor: '#ffffff',
//         padding: 20,
//         borderRadius: 15,
//         elevation: 5,
//         paddingHorizontal:30
//     },
//     welcomeText: {
//         fontSize: 28,
//         fontWeight: 'bold',
//         color: '#333',
//         textAlign: 'center',
//     },
//     loginText: {
//         fontSize: 16,
//         color: '#777',
//         fontWeight: 'bold',
//         textAlign: 'center',
//         marginBottom: 30,
//     },
//     input: {
//         borderBottomWidth: 1,
//         borderBottomColor: '#ccc',
//         paddingLeft:0,
//         paddingBottom: 10,
//         fontSize: 14,
//         marginBottom: 5,
//     },
//     errorText: {
//         color: '#ff0000', // Error message in red color
//         fontSize: 14,
//         marginBottom: 5,
//     },
//     verifyButton: {
//         backgroundColor: '#419fb8',
//         paddingVertical: 12,
//         borderRadius: 25,
//         // width:40,
//         alignItems: 'center',
//         marginTop:10
//     },
//     verifyButtonText: {
//         color: '#ffffff',
//         fontSize: 14,
//         fontWeight: 'bold',
//     },
//     bottomContainer: {
//         alignItems: 'flex-end',
//         paddingVertical: 5,
//         marginTop: 15,
//     },
//     chatContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'flex-end',
//         marginBottom: 5,
//     },
//     chatIcon: {
//         width: 50,
//         height: 60,
//         marginLeft: 10,
//     },
//     chatText: {
//         fontSize: 16,
//         color: '#333',
//         // fontWeight:'bold'
//         fontStyle: 'italic',
//     },
//     infoText: {
//         fontSize: 14,
//         color: '#419fb8',
//         textAlign: 'center',
//         paddingHorizontal: 20,
//         fontWeight: 'bold',
//         marginTop: '35%',
//     },
// });

// export default Signup;

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import LottieView from 'lottie-react-native'; // Lottie for animations
import HttpRequest from '../utils/HTTPRequest';
import FlashMessage, { showMessage } from 'react-native-flash-message';

const Signup = ({ navigation }) => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [error, setError] = useState('');

    // Handle verifying the mobile number
    const handleVerifyNumber = async () => {
        if (mobileNumber.length < 10) {
            setError("Mobile number must be exactly 10 digits");
        } else {
            setError('');
            try {
                const res = await HttpRequest.login({
                    mobile: mobileNumber
                });

                if (res.status === 200) {
                    showMessage({
                        message: "OTP sent to your Mobile Number!", // Success message
                        type: "success", // Message type
                        backgroundColor: '#419fb8', // Custom background color
                        position: 'bottom',
                        duration: 2000, // Duration of the message
                    });
                    navigation.navigate('History', { mobileNumber });
                } else {
                    console.log('Error occurred:', res);
                }
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'Failed to process request. Please try again.');
            }
        }
    };

    // Handle changes in mobile number input
    const handleMobileNumberChange = (text) => {
        const numericText = text.replace(/[^0-9]/g, '');
        if (numericText === '') {
            setError('');
        }
        else if (numericText.length === 1 && !['6', '7', '8', '9'].includes(numericText[0])) {
            setError("Mobile number must start with a digit between 6 and 9");
        }
        else if (numericText.length >= 1 && ['6', '7', '8', '9'].includes(numericText[0])) {
            if (numericText.length < 10) {
                setError("Mobile number must be exactly 10 digits");
            } else {
                setError('');
            }
        }

        setMobileNumber(numericText);
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require('../assests/logo.png')} style={styles.logo} />
            </View>

            {/* Welcome and Mobile Number Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.welcomeText}>Welcome!</Text>
                <Text style={styles.loginText}>Login To Continue</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter Your Mobile No."
                    value={mobileNumber}
                    onChangeText={handleMobileNumberChange}
                    keyboardType="numeric"
                    maxLength={10} // Mobile number usually has 10 digits
                />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                {/* Verify Button */}
                <TouchableOpacity
                    style={[styles.verifyButton, { opacity: error ? 0.5 : 1 }]} // Make button less opaque if there's an error
                    onPress={handleVerifyNumber}
                    disabled={!!error} // Disable the button if there's an error
                >
                    <Text style={styles.verifyButtonText}>Verify Number</Text>
                </TouchableOpacity>
            </View>

            {/* Bottom Section with Chat Icon and Info */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.chatContainer} onPress={() => navigation.navigate('Contact Us')}>
                    <Text style={styles.chatText}>Hello!</Text>
                    <Image source={require('../assests/support-icon.png')} style={styles.chatIcon} />
                </TouchableOpacity>

                <Text style={styles.infoText}>
                    We process our loans through RBI Licenced NBFC's Zed Leafin Pvt Ltd & Finkurve Financial Services Limited.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 5,
    },
    logo: {
        width: 180,
        height: 180,
        resizeMode: 'contain',
    },
    inputContainer: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 15,
        elevation: 5,
        paddingHorizontal: 30
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    loginText: {
        fontSize: 16,
        color: '#777',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingLeft: 0,
        paddingBottom: 10,
        fontSize: 14,
        marginBottom: 5,
    },
    errorText: {
        color: '#ff0000', // Error message in red color
        fontSize: 14,
        marginBottom: 5,
    },
    verifyButton: {
        backgroundColor: '#419fb8',
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10
    },
    verifyButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    bottomContainer: {
        alignItems: 'flex-end',
        paddingVertical: 5,
        marginTop: 15,
    },
    chatContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 5,
    },
    chatIcon: {
        width: 50,
        height: 60,
        marginLeft: 10,
    },
    chatText: {
        fontSize: 16,
        color: '#333',
        fontStyle: 'italic',
    },
    infoText: {
        fontSize: 14,
        color: '#419fb8',
        textAlign: 'center',
        paddingHorizontal: 20,
        fontWeight: 'bold',
        marginTop: '35%',
    },
});

export default Signup;

