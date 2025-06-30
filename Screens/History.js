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
import { useSmsUserConsent } from '@eabdullazyanov/react-native-sms-user-consent';
import HTTPRequest from '../utils/HTTPRequest';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../Redux/Action';
import AuthContext from '../ContextApi/AuthContext';
import EncryptedStorage from 'react-native-encrypted-storage';
import FlashMessage, { showMessage } from 'react-native-flash-message';

const { width } = Dimensions.get('window');

const OTPVerificationScreen = ({ navigation, route }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [phone, setPhone] = useState(route?.params?.mobileNumber || '');
  const [timer, setTimer] = useState(60); // Timer for resend
  const otpInputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { login } = useContext(AuthContext);
  const retrievedCode = useSmsUserConsent();

  // Timer logic for resending OTP
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);



  // Autofill OTP handling
  useEffect(() => {
    if (retrievedCode) {
      const codeArray = retrievedCode.trim().slice(0, 6).split(''); // Ensure only 6 digits
      if (codeArray.length === 6) {
        setOtp(codeArray);
        codeArray.forEach((digit, index) => {
          if (otpInputRefs.current[index]) {
            otpInputRefs.current[index].setNativeProps({ text: digit });
          }
        });
        setTimeout(() => verifyOtp(codeArray), 0); // Auto-submit after autofill
      }
    }
  }, [retrievedCode]);

  const handleOtpChange = (value, index) => {
    // Ensure the value is numeric and not a special character
    if (/[^0-9]/.test(value)) {
      return; // Ignore if the value is not a number
    }
  
    const otpArray = [...otp];
    otpArray[index] = value;
    setOtp(otpArray);
  
    // Move focus to the next input if a value is entered
    if (value && index < otp.length - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  
    // Auto-submit when all fields are filled
    if (otpArray.every((digit) => digit !== '')) {
      setTimeout(() => verifyOtp(otpArray), 0);
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace') {
      const otpArray = [...otp];
      otpArray[index] = '';
      setOtp(otpArray);

      // Move focus to the previous input if it exists
      if (index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    }
  };

  const verifyOtp = async (otpArray = otp) => {
    const otpString = otpArray.join('');
    if (otpString.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const res = await HTTPRequest.otpVerify({ mobile: phone, otp: otpString });

      if (res.status === 200) {
        const response = res.data;
        if (response.response_status === 1) {
          const { id, user_id } = response.response_data;
          await EncryptedStorage.setItem('token', JSON.stringify({ token: id }));
          await EncryptedStorage.setItem('user_id', JSON.stringify({ user_id }));
          dispatch(loginSuccess(id));
          login(id);
          showMessage({
            message: 'Login Successful!',
            type: 'success',
            duration: 2000,
          });
        } else if (response.response_status === 2) {
          Alert.alert('Error', 'Invalid OTP.');
        } else if (response.response_status === 3) {
          Alert.alert('Error', 'Account disabled. Contact support.');
        } else {
          navigation.navigate('Register', { mobile: phone });
        }
      } else {
        Alert.alert('Error', 'OTP verification failed.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      console.log('mmmmmmmmm')
      const res = await HTTPRequest.login({ mobile: phone });
      if (res.status === 200) {
        setTimer(60); // Reset timer
      } else {
        Alert.alert('Error', 'Failed to resend OTP.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while resending OTP.');
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#419FB8" />
      ) : (
        <>
          <LottieView
            source={require('../assests/lottie/login-verification.json')}
            autoPlay
            loop
            style={styles.lottieView}
          />
          <View style={styles.inputContainer}>
            <Text style={styles.title}>Verify Number</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit OTP sent to +91 {phone}
            </Text>
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
              <TouchableOpacity onPress={resendOtp}>
                <Text style={styles.resendText}>Resend OTP</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.verifyButton} onPress={() => verifyOtp()}>
              <Text style={styles.verifyButtonText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    width: width * 0.9,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#777',
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', // Evenly spaces out the inputs
    marginBottom: 20,
  },
  otpInput: {
    width: 40, // Adjusted width for better spacing
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 8, // Rounded corners for better design
    marginHorizontal: 5, // Margin for spacing
  },
  lottieView: {
    width: '100%',
    height: 150,
    marginBottom: 20,
  },
  timerText: {
    textAlign: 'center',
    color: '#777',
    marginBottom: 20,
  },
  resendText: {
    textAlign: 'center',
    color: '#419FB8',
    marginBottom: 20,
  },
  verifyButton: {
    backgroundColor: '#419FB8',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OTPVerificationScreen;
