import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Head from './Header';
import HTTPRequest from '../utils/HTTPRequest';
import LottieView from 'lottie-react-native'; // Lottie for animations

const ResidentialInformationScreen = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [houseNo, setHouseNo] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState('');
  const [stateId, setStateId] = useState('');
  const [cityId, setCityId] = useState('');
  const [city, setCity] = useState('');
  const [resident, setResident] = useState({})
  const [address, setAddress] = useState('');
  const [show, setShow] = useState('');
  const [errors, setErrors] = useState({});


  const fetchData = useCallback(async () => {
    try {
      setLoading(true); // Start loading when fetchData is invoked
      await Promise.all([
        await fetchResident(),
        await fetchUrl(),

      ]);
      // Needs sequential execution due to `setLoan` dependency
    } catch (error) {
      console.error('Error in fetchData:', error);
    } finally {
      setLoading(false); // End loading when all data is fetched
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [fetchData, navigation]);


  const fetchUrl = async () => {

    setLoading(true);
    try {
      const response = await HTTPRequest.repaymentApi();
      if (response.status === 200) {
        const userData = response.data.response_data;
        console.log(userData, 'userData');
        setShow(userData.loanstatus)
      } else {
        Alert.alert('Error', 'Failed to fetch user data');
      }

    } catch (error) {
      console.error("Error fetching URL:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResident = async () => {
    setLoading(true)
    try {
      const res = await HTTPRequest.residentialDetails();
      if (res.status === 200) {
        const val = res.data.response_data;
        console.log(val, 'vals')
        if (val == '' || val == null || val == undefined) {
          console.log(val);
        } else {
          setHouseNo(val.cur_houseno);
          setLandmark(val.cur_landmark);
          setPincode(val.cur_pincode);
          setStateId(val.cur_state)
          setState(val.cur_state_name);
          setCity(val.cur_city_name);
          setCityId(val.cur_city);
          setResident(val);
          setAddress(val.cur_address)
        }
      } else {
        Alert.alert('Error', 'Invalid Data');
      }
    } catch (error) {
      // Alert.alert('Error', 'Failed to fetch data for the Residential Detail');
    } finally {
      setLoading(false)
    }
  };


  const handleEditToggle = () => {
    setIsEditing(!isEditing);
};

  const handlePincodeChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, ''); // Allow only numeric values

    // Clear errors if any
    if (errors.pincode) {
      setErrors((prevErrors) => ({ ...prevErrors, pincode: '' }));
    }

    // Check if pincode starts with '0'
    if (numericValue.length > 0 && numericValue[0] === '0') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        pincode: 'Pincode should not start with 0',
      }));
      setState('');
      setCity('');
      return; // Stop further processing
    }

    // Update pincode state
    setPincode(numericValue);

    // Validate length for fetching city/state
    if (numericValue.length === 6) {
      console.log('skdjjkdjk')
      fetchCityState(numericValue);
    } else {
      setState('');
      setCity('');
      // setIsStateCityEditable(false);
    }
  };

  const fetchCityState = async (pincode) => {
    try {
      const res = await HTTPRequest.allPincode({ pincode });
      if (res.status === 200) {
        const val = res.data.response_data;
        console.log(val, 'val');
        if (res.data.response_status === 1) {
          setState(val.State || '');
          setCity(val.District || '');
          setCityId(val.city_id || '');
          setStateId(val.state_id || '');
          // setIsStateCityEditable(false); // Disable dropdowns when valid data is returned
        } else {
          setState('');
          setCity('');
          // console.log('gyuguk')
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


  const validateFields = () => {
    const newErrors = {};
    if (!landmark || landmark.trim() === '') {
      newErrors.landmark = 'Landmark is required and cannot be blank.';
    } else {
      // Check for special characters at the beginning and elsewhere
      const landmarkRegex = /^[A-Za-z0-9][A-Za-z0-9\s.,-]*$/; // First character must be alphanumeric, then others can be letters, numbers, spaces, ., and -

      if (!landmarkRegex.test(landmark)) {
        newErrors.landmark = 'Landmark should not start with special characters and should only contain letters, numbers, spaces, . and -';
      }
    }

    if (!houseNo || houseNo.trim() === '') {
      newErrors.house = 'House No. is required and cannot be blank.';
    } else {
      // Allow letters, numbers, spaces, ., -, ,, and /
      const landmarkRegex = /^[A-Za-z0-9\s.,\/-]*$/; // Includes the / character

      if (!landmarkRegex.test(houseNo)) {
        newErrors.house = 'House No. can only contain letters, numbers, spaces, ., comma, hyphen, and slash (/).';
      }
    }

    if (!address || address.trim() === '') {
      newErrors.address = 'Address is required and cannot be blank.';
    } else {
      // Check for special characters at the beginning and elsewhere
      const addressRegex = /^[A-Za-z0-9][A-Za-z0-9\s.,-]*$/; // First character must be alphanumeric, then others can be letters, numbers, spaces, ., and -

      if (!addressRegex.test(address)) {
        newErrors.address = 'Address should not start with special characters and should only contain letters, numbers, spaces, . and -';
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      return;
    }
    const payload = {
      cur_houseno: houseNo,
      cur_address: address,
      cur_city: cityId,
      cur_landmark: landmark,
      cur_pincode: pincode,
      cur_state: stateId,
      per_address: resident.per_address,
      per_houseno: resident.per_houseno,
      per_landmark: resident.per_landmark,
      per_city: resident.per_city,
      per_pincode: resident.per_pincode,
      per_state: resident.per_state,
      residence_type: resident.residence_type,
    };
    console.log(payload, 'paylod')
    try {
      const response = await HTTPRequest.updateResidential(payload);
      if (response.status === 200) {
        console.log(response.data, 'jjjjmmm')
        if (response.data.response_status === 1) {
          // ToastAndroid.show('Data submitted successfully!', ToastAndroid.SHORT);
          // navigation.goBack();
          setIsEditing(!isEditing);
        } else {
          Alert.alert('Error', 'Failed to update');
        }
      } else {
        // Alert.alert('Error', 'Failed to fetch branch details.');
      }
    } catch (error) {
      console.error('Error fetching branch details:', error);
      // Alert.alert('Error', 'An error occurred while fetching branch details.');
    }
  };




  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* <ActivityIndicator size="large" color="#419FB8" /> */}
        <LottieView
          source={require('../assests/lottie/loading3.json')}
          autoPlay
          loop
          style={styles.iconImage1}
        />
        {/* <Text style={styles.loadingText}>Loading...</Text> */}
      </View>
    );
  }

  return (
    <View style={styles.container1}>
      <Head title="Residential Details" />

      <View style={styles.container}>
        <View style={styles.infoItem}>
          <Icon name="house" size={20} color="#6a1b9a" />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>House No./Flat No./Apartment/Building</Text>
            {isEditing ? (
              <TextInput style={styles.input} value={houseNo} onChangeText={setHouseNo} />
            ) : (
              <Text style={styles.infoValue}>{houseNo == '' ? 'No Data Found!' : houseNo}</Text>
            )}
          </View>
        </View>

        <View style={styles.infoItem}>
          <Icon name="public" size={20} color="#6a1b9a" />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Land Mark</Text>
            {isEditing ? (
              <TextInput style={styles.input} value={landmark} onChangeText={setLandmark} />
            ) : (
              <Text style={styles.infoValue}>{landmark == '' ? 'No Data Found!' : landmark}</Text>
            )}
          </View>
        </View>

        <View style={styles.infoItem}>
          <Icon name="apartment" size={20} color="#6a1b9a" />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Address</Text>
            {isEditing ? (
              <>
                <TextInput
                  style={styles.input}
                  value={address}
                  onChangeText={(value) => setAddress(value)}
                  placeholder="Address"
                  maxLength={40}
                />
                <Text style={styles.infoTitle1}>Pincode</Text>

                <TextInput
                  style={styles.input}
                  value={pincode}
                  onChangeText={handlePincodeChange}
                  keyboardType="numeric"
                  maxLength={6}
                  placeholder="Pincode"
                />
                <Text style={styles.infoTitle1}>City</Text>

                <TextInput
                  style={styles.input}
                  value={city}
                  editable={false}
                  placeholder="City"
                />
                <Text style={styles.infoTitle1}>State</Text>

                <TextInput
                  style={styles.input}
                  value={state}
                  editable={false}
                  placeholder="State"
                />

              </>
            ) : (
              <Text style={styles.infoValue}>
              {houseNo && address && city && state && pincode
                ? `${houseNo}, ${address}, ${city}, ${state}, ${pincode}`
                : 'No Data Found!'}
            </Text>
            )}
          </View>
        </View>
                        {/* <View style={styles.footer}>
        
        {show == '' || show == '5' || show == '3' || show == '4'? 
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              if (isEditing) {
                handleSubmit();  // Call the function to save data
              }
              handleEditToggle(); // Toggle edit mode
            }}
          >
            <Text style={styles.editButtonText}>{isEditing ? 'Save Details' : 'Edit Details'}</Text>
          </TouchableOpacity>
          : null}
          </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  container1: {
    flex: 1,
    // padding: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    marginBottom: 10,
  },
  backArrow: {
    fontSize: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: 'flex-start',
    marginBottom: 15,

  },
  infoText: {
    marginLeft: 10,
    width: '90%',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    // marginBottom:10,
  },
  infoTitle1: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
  infoValue: {
    fontSize: 14,
    color: "#666",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#6a1b9a",
    fontSize: 14,
    width: '100%',
    // marginVertical: 5,
    paddingVertical: 3,
  },
  editButton: {
    borderWidth: 1,
    borderColor: "#6a1b9a",
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
    position: 'absolute',
    bottom: '10%',
    width: '90%',
    margin: 'auto',
    left: '10%',
    right: '10%',

  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop:'50%',
    marginBottom:'10%',

  },
  buttonText: {
    color: "#6a1b9a",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ResidentialInformationScreen;
