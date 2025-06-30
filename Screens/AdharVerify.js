import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LottieView from 'lottie-react-native';
import HTTPRequest from '../utils/HTTPRequest';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../Redux/Action';
import AuthContext from '../ContextApi/AuthContext';
import EncryptedStorage from 'react-native-encrypted-storage';
const { width } = Dimensions.get('window');
import FlashMessage, { showMessage } from 'react-native-flash-message';

const AdharVerify = ({ navigation, route }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);  // Array to store OTP digits
  const [clients, setClients] = useState(route?.params?.client || ''); // Client info
  const [page, setPage] = useState(route?.params?.pages || ''); // Page info
  const [loading, setLoading] = useState(false);  // Loading state
  const [timer, setTimer] = useState(240); // OTP timer
  const otpInputRefs = useRef([]); // Refs for OTP inputs
  const dispatch = useDispatch();
  const { login } = useContext(AuthContext); // Login function from context

  // Timer for resending OTP
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  // Format time (minutes:seconds) for OTP timer
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle OTP input change
  const handleOtpChange = (value, index) => {
    if (/[0-9]/.test(value)) { // Only allow numeric values
      const otpArray = [...otp];
      otpArray[index] = value;
      setOtp(otpArray);

      // Move focus to the next input if valid input
      if (value && index < otp.length - 1) {
        otpInputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle backspace for OTP input
  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace') {
      const otpArray = [...otp];
      otpArray[index] = ''; // Clear current OTP digit
      setOtp(otpArray);

      // Move focus to the previous input if exists
      if (index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    }
  };

  // OTP verification
  const verifyOtp = async () => {
    const otpString = otp.join('');  // Join the OTP array into a string

    // Ensure OTP has all 6 digits before proceeding
    if (otpString.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit OTP.');
      return;
    }

    console.log('Verifying OTP:', otpString);
    try {
      setLoading(true); // Show loading spinner

      const res = await HTTPRequest.adharOtpVerify({
        client_id: clients,
        otp: otpString,
      });

      if (res.status === 200) {
        var rts = res.data;
        var ss = rts.response_data;

        // Check if OTP verification is successful
        if (rts.response_status === 1) {
          showMessage({
            message: rts.response_msg, // Success message
            type: "success", // Message type
            backgroundColor: '#419fb8', // Custom background color
            position: 'bottom',
            duration: 2000, // Duration of the message
          });

          // Navigate to the appropriate page
          if (page === 'DASHBOARD') {
            navigation.navigate('Home');
          } else {
            const accessToken1 = await EncryptedStorage.getItem('token');
            const parsedToken1 = JSON.parse(accessToken1);
            const appId1 = parsedToken1?.token;
            // setLoading(false);
            dispatch(loginSuccess(appId1));
            await login(appId1);
          }
        } else {
          Alert.alert('Error', rts.response_msg);
        }
      } else {
        console.log('Error occurred:', res);
        // Alert.alert('Error', 'OTP verification failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      // Alert.alert('Error', 'Failed to process request. Please try again.');
    }finally{
      setLoading(false);
    }
  };

  // Show loading spinner if loading is true

  
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#419FB8" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assests/lottie/login-verification.json')}
        autoPlay
        loop
        style={styles.chatIcon}
      />

      <View style={styles.inputContainer}>
        <Text style={styles.subtitle}>Enter the 6-digit OTP sent to Your Registered Aadhaar Mobile Number</Text>

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
          <Text style={styles.timerText}>Resend OTP in {formatTime(timer)}</Text>
        ) : (
          <TouchableOpacity onPress={verifyOtp}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.verifyButton} onPress={verifyOtp}>
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    width: width * 0.9,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 20,
    color: '#777',
    textAlign: 'flex-start',
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
  },
  chatIcon: {
    width: '100%',
    height: 150,
    marginBottom: 20,
  },
  timerText: {
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
  },
  resendText: {
    color: '#00A8E8',
    textAlign: 'center',
    marginBottom: 20,
  },
  verifyButton: {
    backgroundColor: '#00A8E8',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AdharVerify;
