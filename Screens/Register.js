import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  BackHandler,
  FlatList,
  Keyboard,
  Modal,
  AppState,
  Linking,
  ActivityIndicator, // Import ActivityIndicator for loading
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import HTTPRequest from '../utils/HTTPRequest';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../Redux/Action';
import AuthContext from '../ContextApi/AuthContext';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import LottieView from 'lottie-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FloatingPlaceholderInput from './FloatingPlaceholderInput';
import Geolocation from 'react-native-geolocation-service';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import auth from '@react-native-firebase/auth';
import { closeApp } from './AppExit';

GoogleSignin.configure({
  webClientId: '19120401926-ejcu9eb00suo54v1repqsu600geeugrj.apps.googleusercontent.com',
  offlineAccess: true,
});

const Register = ({ navigation, route }) => {
  const [panNumber, setPanNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState(route?.params?.mobile || '');
  // console.log(mobileNumber)
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [state, setState] = useState('');
  const [states, setStates] = useState([]);
  const [citys, setCitys] = useState([]);
  const [city, setCity] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [employmentOptions, setEmploymentOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [stateId, setStateId] = useState('');
  const [cityId, setCityId] = useState('');
  const dispatch = useDispatch();
  const { login } = useContext(AuthContext);
  const [keyboardType, setKeyboardType] = useState('default'); // Default keyboard type
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  const [isSigningIn, setIsSigningIn] = useState(false);
  const inputRef = useRef(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible1, setModalVisible1] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isStateCityEditable, setIsStateCityEditable] = useState(false); // Flag for enabling/disabling dropdowns
  const [appState, setAppState] = useState(AppState.currentState);



  const fetchCityState = async (pincode) => {
    try {
      const res = await HTTPRequest.allPincode({ pincode });
      if (res.status === 200) {
        const val = res.data.response_data;
        // console.log(res.data, 'val');
        if (res.data.response_status == 1) {
          setState(val.State || '');
          setCity(val.District || '');
          setCityId(val.city_id || '');
          setStateId(val.state_id || '');
          setIsStateCityEditable(false); // Disable dropdowns when valid data is returned
        } else {
          setState('');
          setCity('');
          setIsStateCityEditable(true); // Enable dropdowns when response_status is 0
        }
      } else {
        Alert.alert('Error', 'Invalid Pincode');
        setState('');
        setCity('');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch data for the given pincode');
      setState('');
      setCity('');
    }
  };


  const fetchCitiesByState = async (stateId) => {
    // console.log('aaa')
    try {
      const res = await HTTPRequest.fetchCitiesByState({ state_id: stateId }); // Assuming this is the correct API endpoint
      if (res.status === 200) {
        // console.log(res.data.response_data)
        const cityOptions = res.data.response_data.map((city) => ({
          label: city.city,
          value: city.city_id,
        }));
        setCitys(cityOptions);  // Update city options
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      Alert.alert('Error', 'Failed to fetch cities for the selected state');
    }
  };


  useEffect(() => {
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


  const handleStateSelect = (state) => {
    console.log(state, '1')
    setCity('');
    setCityId('');
    setState(state.label);
    setStateId(state.value);
    setModalVisible(false);
    setSearchText('');
    Keyboard.dismiss();  // Dismiss the keyboard explicitly
    fetchCitiesByState(state.value);
  };
  const handleCitySelect = (state) => {
    console.log(state, '2')
    setCity(state.label);
    setCityId(state.value);
    setModalVisible1(false);
    setSearchText('');
    Keyboard.dismiss();  // Dismiss the keyboard explicitly
  };

  const filterCities = citys.filter(city =>
    city.label.toLowerCase().includes(searchText.toLowerCase())
  );


  const filteredStates = states.filter(state =>
    state.label.toLowerCase().includes(searchText.toLowerCase())
  );


  const signIn = async () => {
    if (isSigningIn) {
      // Prevent duplicate sign-in attempts
      return;
    }

    try {
      setLoading(true)
      setIsSigningIn(true); // Set signing-in flag to true

      // Sign out to clear previous sessions (optional, if you want to force account picker)
      await GoogleSignin.signOut();

      // Perform Google Sign-In
      setLoading(false)
      const userInfo = await GoogleSignin.signIn();
      // Process the user info
      setEmail(userInfo.data.user.email); // Update email state
      // console.log('Google User Info:', userInfo);
    } catch (error) {
      console.error('Google Sign-In Error:', error);

      // Handle specific error
      if (error.code === 'SIGN_IN_CANCELLED') {
        Alert.alert('Sign-In Cancelled', 'You cancelled the sign-in process.');
      } else if (error.code === 'IN_PROGRESS') {
        Alert.alert('Sign-In in Progress', 'Please wait while sign-in completes.');
      } else {
        Alert.alert('Warning', "You Didn't Select Any Account");
      }
    } finally {
      setIsSigningIn(false); // Reset signing-in flag
    }
  };

  const fetchEmploymentTypes = async () => {
    try {
      const response = await HTTPRequest.getEmploymentTypes();
      if (response.status === 200) {
        const types = response.data.response_data.map((type) => ({
          label: type.name,
          value: type.employment_type_id,
        }));
        setEmploymentOptions(types);
      } else {
        Alert.alert('Error', 'Failed to fetch employment types.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching employment types.');
    }
  };

  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
        );
        console.log(granted, 'granted');
        if (granted) {
          await getCurrentLocation(); // Fetch location directly
        } else {
          await requestLocationPermission(); // Request permission if not granted
        }
      } catch (error) {
        console.error('Error checking location permission:', error);
      }
    };

    checkLocationPermission();
    fetchEmploymentTypes(); // Fetch employment types as part of initialization
    fetchState();
  }, []);

  const fetchState = async () => {
    try {
      const res = await HTTPRequest.callState();
      if (res.status === 200) {
        // console.log(res.data.response_data);
        var sta = res.data.response_data;
        const stateOptions = sta.map((type) => ({
          label: type.state,
          value: type.state_id,
        }));
        console.log(stateOptions, 'gfguk')
        setStates(stateOptions);
      }
    } catch {
      Alert.alert('Error', 'Failed to fetch state');
    }

  };


  const getCurrentLocation = async () => {
    try {
      console.log('Fetching current location...');
      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Await the asynchronous `setLocation` call
          await setLocation({ latitude, longitude });
          try {
            await EncryptedStorage.setItem('location', JSON.stringify({ latitude, longitude }));
            console.log('Location saved to EncryptedStorage:', { latitude, longitude });
          } catch (error) {
            console.error('Error saving location to EncryptedStorage:', error);
          }
        },
        (error) => {
          console.error('Error fetching location:', error);
        },
        { enableHighAccuracy: false, timeout: 300000, maximumAge: 800000 }
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
        Alert.alert(
          'Permission Denied',
          'Location permission is required to fetch the address. Please enable it in app settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => closeApp() },
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const handlePincodeChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, ''); // Allow only numeric values

    // Clear errors if any
    if (errors.pinCode) {
      setErrors((prevErrors) => ({ ...prevErrors, pinCode: '' }));
    }

    // Check if pincode starts with '0'
    if (numericValue.length > 0 && numericValue[0] === '0') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        pinCode: 'Pincode should not start with 0',
      }));
      setState('');
      setCity('');
      return; // Stop further processing
    }

    // Update pincode state
    setPinCode(numericValue);

    // Validate length for fetching city/state
    if (numericValue.length === 6) {
      fetchCityState(numericValue);
    } else {
      setState('');
      setCity('');
      setIsStateCityEditable(false);
    }
  };


  const handlePanChange = (value) => {
    // Limit the input to 10 characters
    if (value.length > 10) return;

    // Remove any non-alphabetic or non-numeric characters
    const numericValue = value.replace(/[^A-Za-z0-9]/g, '');

    // Handle the pincode format
    if (numericValue.length <= 5) {
      // Allow only letters in the first part
      if (/^[A-Za-z]*$/.test(numericValue)) {
        setPanNumber(numericValue.toUpperCase()); // Convert letters to uppercase
        // setError('');
      }
    } else if (numericValue.length > 5 && numericValue.length <= 9) {
      const firstPart = panNumber.slice(0, 5); // First 5 characters remain the same
      const lastPart = numericValue.slice(5);  // Only digits allowed for the next 4 characters
      if (/^\d*$/.test(lastPart)) {
        setPanNumber(firstPart + lastPart);
        // setError('');
      }
    } else if (numericValue.length === 10) {
      const firstPart = panNumber.slice(0, 9);
      const lastChar = numericValue[9];
      if (/^[A-Za-z]$/.test(lastChar)) {
        setPanNumber(firstPart + lastChar.toUpperCase()); // Make sure it's uppercase
        // setError('');
      }
    }

    // Dynamically change keyboardType based on input length
    let newKeyboardType = 'default';
    if (numericValue.length < 5 || numericValue.length === 9) {
      newKeyboardType = 'default';
    } else if (numericValue.length >= 5 && numericValue.length < 9) {
      newKeyboardType = 'numeric';
    }
    setKeyboardType(newKeyboardType);
  };
  // Error checking function (example)
  const validatePan = () => {
    let errors = {};
    if (panNumber.length < 10) {
      errors.panNumber = 'PAN Number must be 10 characters';
    }
    setErrors(errors);
  };

  const validateFields = () => {
    const newErrors = {};
    if (!panNumber) newErrors.panNumber = 'PAN number is required';
    else if (panNumber.length < 10) newErrors.panNumber = 'PAN number must be 10 characters';
    if (!fullName || fullName.trim() === '') {
      newErrors.fullName = 'Full name is required and cannot be blank';
    } else if (!/^[A-Za-z\s'-]+$/.test(fullName)) {
      newErrors.fullName = 'Full name should only contain letters, spaces, apostrophes, and hyphens';
    }

    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';

    if (!dob) newErrors.dob = 'Date of birth is required';

    if (!pinCode) newErrors.pinCode = 'Pin code is required';
    else if (pinCode.length !== 6) newErrors.pinCode = 'Pin code must be 6 digits';

    if (!state) newErrors.state = 'State is required';

    if (!city) newErrors.city = 'City is required';

    if (!employmentType) newErrors.employmentType = 'Employment type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);


  const reverseGeocode = async () => {
    setLoading(true)
    try {
      if (location.latitude && location.longitude) {
       
        const data = {
          latitude: location.latitude,
          longitude: location.longitude,
          address: '',
          nooffakeapplication: "None",
          fakeenable: "None",
          status: "Registration Page",
          loan_no: "",
        };
        // dispatch(setLocation(latitude, longitude));
        const response = await HTTPRequest.Location(data);
        if (response.status === 200) {
          // navigation.navigate("AddAdhar", { page: "REGISTER" });
          const accessToken1 = await EncryptedStorage.getItem('token');
          const parsedToken1 = JSON.parse(accessToken1);
          const appId1 = parsedToken1?.token;
          // setLoading(false);
          dispatch(loginSuccess(appId1));
          await login(appId1);
        } else {
          console.error("Error while sending location data.");
        }
      } else {
        const locationString = await EncryptedStorage.getItem('location');

        if (locationString !== null) {
          // If the item exists, parse the JSON string into an object
          const locations = JSON.parse(locationString);

          console.log('Retrieved location:', locations);

          const data = {
            latitude: location.latitude,
            longitude: location.longitude,
            address: '',
            nooffakeapplication: "None",
            fakeenable: "None",
            status: "Registration Page",
            loan_no: "",
          };
          // dispatch(setLocation(latitude, longitude));
          const response = await HTTPRequest.Location(data);
          if (response.status === 200) {
            console.log(response.data,'bbbbb');
            // navigation.navigate("AddAdhar", { page: "REGISTER" });
            const accessToken1 = await EncryptedStorage.getItem('token');
            const parsedToken1 = JSON.parse(accessToken1);
            const appId1 = parsedToken1?.token;
            // setLoading(false);
            dispatch(loginSuccess(appId1));
            await login(appId1);
          } else {
            console.error("Error while sending location data.");
          }
        }
      }
    } catch (error) {
      console.error("Error in reverse geocode:", error);
    } finally {
      setLoading(false)
    }
  };

  const handleRegister = async () => {
    if (!validateFields()) {
      return;
    }
    const locationPermissionGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
    );

    if (!locationPermissionGranted) {
      const permissionRequestResult = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: 'Location Permission Required',
          message: 'Location access is needed to complete the registration.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'Grant Permission',
        }
      );

      if (permissionRequestResult !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          'Permission Denied',
          'Location permission is mandatory for registration. Please enable it in app settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return; // Exit if permission is not granted
      }
    }

    // Fetch location after permissions are granted
    await getCurrentLocation();

    // Ensure location is fetched successfully
    setLoading(true);

    const accessToken = await EncryptedStorage.getItem("app_id");
    const parsedToken = JSON.parse(accessToken);
    const appId = parsedToken?.app_id;

    const payload = {
      name: fullName,
      mobile: mobileNumber,
      pan_no: panNumber,
      city_location: cityId,
      state_location: stateId,
      pincode_location: pinCode,
      email: email,
      dob: dob,
      employment_type: employmentType,
      app_id: appId,
    };

    // Start loading


    try {
      console.log(payload);
      const response = await HTTPRequest.registration(payload);
      console.log(response.data, 'mmm')
      if (response.status === 200) {
        console.log(response.data, 'vvvv')
        if (response.data.response_status === 1) {
          console.log(response.data.response_data.id, "token");
          const randomValue1 = { token: response.data.response_data.id };
          await EncryptedStorage.setItem("token", JSON.stringify(randomValue1));
          const randomValue2 = { user_id: response.data.response_data.user_id };
          await EncryptedStorage.setItem("user_id", JSON.stringify(randomValue2));

          showMessage({
            message: "Registration Successfully!", // Success message
            type: "success", // Message type
            backgroundColor: "#419fb8", // Custom background color
            position: "bottom",
            duration: 2000, // Duration of the message
          });

          // Ensure reverseGeocode completes before setting loading to false
          await reverseGeocode();
        } else {
          Alert.alert("Error", response.data.response_msg);
        }
      } else {
        Alert.alert("Error", "Failed to register.");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data.response_msg || "Registration failed. Please try again."
      );
    } finally {
      // Stop loading only after reverseGeocode and navigation are completed
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    if (event.type === 'set' && selectedDate) {
      // Get the individual components of the date
      const month = selectedDate.getMonth() + 1; // Months are zero-indexed
      const day = selectedDate.getDate();
      const year = selectedDate.getFullYear();

      // Format the date as mm-dd-yyyy
      const formattedDate = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;

      // Set the formatted date in the state
      setDob(formattedDate);
    } else {
      // If the user pressed 'Cancel', clear the date input
      setDob('');
    }

    // Close the date picker
    setShowDatePicker(false);
  };

  const handleFullNameChange = (value) => {
    const regex = /^[A-Za-z\s'-]*$/; // Allows: letters, spaces, apostrophes, and hyphens

    if (regex.test(value) || value === '') {
      setFullName(value); // Set the full name if it matches the regex
      setErrors((prevErrors) => ({ ...prevErrors, fullName: '' })); // Clear error
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fullName: 'Full name should not contain special characters.',
      }));
    }
  };


  if (loading) {
    // Show a loading indicator while checking version
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#419FB8" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registration</Text>

      <TextInput
        // ref={inputRef}
        style={[styles.input, errors.panNumber && styles.inputError]}
        placeholder="PAN No."
        value={panNumber}
        onChangeText={handlePanChange}
        maxLength={10}
        autoCorrect={false}
        keyboardType={keyboardType}  // Dynamically changing keyboard type
        autoCapitalize="characters"
        onBlur={validatePan}  // Optional: Validate when the input loses focus
      />
      {errors.panNumber && <Text style={styles.errorText}>{errors.panNumber}</Text>}

      <TextInput
        style={[styles.input, errors.fullName && styles.inputError]}
        placeholder="Full Name (As per PAN Card)"
        value={fullName}
        onChangeText={setFullName} // Use the validation function
        maxLength={50}
      />
      {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

      <View style={styles.mobileContainer}>
        <LottieView
          source={require('../assests/lottie/tick-success.json')}
          autoPlay
          loop
          style={styles.icon}
        />
        {/* <Ionicons name="call" size={20} color="#888" style={styles.icon} /> */}
        <TextInput
          style={[styles.input, styles.disabledInput]}
          placeholder="Mobile No."
          value={mobileNumber}
          editable={false}
        />
      </View>
      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="Email"
        value={email}
        // onChangeText={setEmail}
        onFocus={signIn} // Pass the signIn function
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <FloatingPlaceholderInput
          style={[errors.dob && styles.inputError]}
          placeholder="Date of Birth"
          value={dob}
          editable={false}
        />
      </TouchableOpacity>
      {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}

      {showDatePicker && (
        <DateTimePicker
          value={dob ? new Date(dob.split('-').reverse().join('-')) : new Date()}  // Convert mm-dd-yyyy to Date object
          mode="date"
          display="default"
          maximumDate={maxDate}
          onChange={onDateChange}
        />
      )}
      <Text style={styles.subTitle}>Current Address Details</Text>

      <TextInput
        style={[styles.input, errors.pinCode && styles.inputError]}
        placeholder="Pin Code"
        value={pinCode}
        onChangeText={handlePincodeChange}
        maxLength={6}
        keyboardType="numeric"
      />
      {errors.pinCode && <Text style={styles.errorText}>{errors.pinCode}</Text>}
      {isStateCityEditable ?
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <TextInput style={[styles.input, errors.state && styles.inputError]}
            placeholder="Select State" value={state} editable={false} />
        </TouchableOpacity>
        :
        <TextInput
          style={[styles.input, errors.state && styles.inputError]}
          placeholder="State"
          value={state}
          editable={false}
        />
      }
      {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
      {isStateCityEditable ? (
        state ? (
          // If state is selected, allow opening the modal
          <TouchableOpacity onPress={() => setModalVisible1(true)}>
            <TextInput
              style={[styles.input, errors.state && styles.inputError]}
              placeholder="Select City"
              value={city}
              editable={false}
            />
          </TouchableOpacity>
        ) : (
          // If state is not selected, disable the modal and show an error or non-interactive field
          <TouchableOpacity onPress={() => Alert.alert('', 'Please Select State')}>
            <TextInput
              style={[styles.input, errors.city && styles.inputError]}
              placeholder="Select City"
              value={city}
              editable={false}
            />
          </TouchableOpacity>
        )
      ) : (
        // If isStateCityEditable is false, show the non-editable city field
        <TextInput
          style={[styles.input, errors.city && styles.inputError]}
          placeholder="City"
          value={city}
          editable={false}
        />
      )}
      {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
      <View style={styles.card}>
        <RNPickerSelect
          onValueChange={(value) => setEmploymentType(value)}
          items={employmentOptions}
          style={pickerSelectStyles}
          placeholder={{ label: 'Select Employment Type', value: null }}
          value={employmentType}
          placeholderTextColor="#000"
        />
      </View>
      {errors.employmentType && <Text style={styles.errorText}>{errors.employmentType}</Text>}

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)} // Close on back press
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search State..."
              value={searchText}
              onChangeText={setSearchText}
            />
            <FlatList
              data={filteredStates}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleStateSelect(item)}>
                  <Text style={styles.stateText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={isModalVisible1}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible1(false)} // Close on back press
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search city..."
              value={searchText}
              onChangeText={setSearchText}
            />
            <FlatList
              data={filterCities}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleCitySelect(item)}>
                  <Text style={styles.stateText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
            <TouchableOpacity onPress={() => setModalVisible1(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>


      {/* Show loading indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00A8E8" />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    // padding: 10,
    color: '#000',
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#419fb8",
  },
  inputText: {
    fontSize: 16,
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Ensure transparency is applied
    zIndex: 9999, // Higher priority for modal
  },
  modalContent: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  stateItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  stateText: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 10,
    // fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 5,
  },
  icon: {
    position: 'absolute',
    top: 25, // Adjust to align vertically
    right: '1%', // Adjust to align horizontally
    width: 30, // Adjust size of Lottie animation
    height: 30,
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#419fb8',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    left: 5,
    marginBottom: 15,
    marginTop: 5
  },
  mobileContainer: {
    position: 'relative',
    width: '100%',
  },
  disabledInput: {
    flex: 1,
    backgroundColor: '#EDEDED',
  },
  checkmarkContainer: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 24,
    color: 'green',
  },
  registerButton: {
    backgroundColor: '#419fb8',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '',
    marginBottom: 15,
    backgroundColor: '#fff',
  },
});
export default Register;
