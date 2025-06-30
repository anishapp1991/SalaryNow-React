import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Modal, FlatList, Keyboard, KeyboardAvoidingView, ToastAndroid } from 'react-native';
import Head from './Header';
import RNPickerSelect from 'react-native-picker-select';
import CheckBox from '@react-native-community/checkbox';
import EncryptedStorage from 'react-native-encrypted-storage';
import HTTPRequest from '../utils/HTTPRequest';
import FloatingPlaceholderInput from './FloatingPlaceholderInput';

const Address = ({ navigation, route }) => {
  const { status } = route.params; // Get the status from the route params
  const [landmark, setLandmark] = useState('');
  const [residentType, setResidentType] = useState('');
  const [residentTypes, setResidentTypes] = useState([]);
  const [address, setAddress] = useState('');
  const [house, setHouse] = useState('');
  // const [phouse, setPhouse] = useState('');
  const [pin, setPin] = useState('');
  const [state, setState] = useState('');
  const [states, setStates] = useState([]);
  const [city, setCity] = useState('');
  const [citys, setCitys] = useState([]);
  const [stateId, setStateId] = useState('');
  const [cityId, setCityId] = useState('');
  const [paddress, setPaddress] = useState('');
  const [ppin, setPpin] = useState('');
  const [pstate, setPstate] = useState('');
  const [pstates, setPstates] = useState([]);
  const [pcity, setPcity] = useState('');
  const [pcitys, setPcitys] = useState([]);
  const [pstateId, setPstateId] = useState('');
  const [pcityId, setPcityId] = useState('');
  const [isSameAsCurrent, setIsSameAsCurrent] = useState(false);
  const [isCurrent, setCurrent] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible1, setModalVisible1] = useState(false);
  const [isModalVisible2, setModalVisible2] = useState(false);
  const [isModalVisible3, setModalVisible3] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isStateCityEditable, setIsStateCityEditable] = useState(false); // Flag for enabling/disabling dropdowns



  useEffect(() => {
    if (status == 'View' || status == 'Edit') {
      const fetchResident = async () => {
        setLoading(true)
        try {
          const res = await HTTPRequest.residentialDetails();
          if (res.status === 200) {
            const val = res.data.response_data;
            console.log(val, 'vals')
            setHouse(val.house_no);
            setLandmark(val.cur_landmark);
            setResidentType(val.residencial_status);
            setAddress(val.cur_address1);
            setPin(val.cur_pincode);
            setCurrent(val.currentaddressrequired);
            setStateId(val.cur_state);
            setCityId(val.cur_city);
            setState(val.cur_state_name);
            setCity(val.cur_city_name);
            setPaddress(val.perm_address);
            setPpin(val.perm_pincode);
            setPstate(val.perm_state_name);
            setPcity(val.perm_city_name);
          } else {
            Alert.alert('Error', 'Invalid Data');
          }
        } catch (error) {
          // Alert.alert('Error', 'Failed to fetch data for the Residential Detail');
        } finally {
          setLoading(false)
        }
      }
      fetchResident();

    };

    const fetchStoredData = async () => {
      try {
        const storedCommon = await EncryptedStorage.getItem('commonList');
        const commonData = JSON.parse(storedCommon);
        const accomadationOptions = commonData.commonList.accomadation.map((type) => ({
          label: type.name,
          value: type.name,
        }));
        setResidentTypes(accomadationOptions);
      } catch (error) {
        console.error('Failed to fetch stored data', error);
      }
    };
    fetchStoredData();
    fetchState();

  }, [status]);

  const filterCities = citys.filter(city =>
    city.label.toLowerCase().includes(searchText.toLowerCase())
  )

  const filteredStates = states.filter(state =>
    state.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleStateSelect = (state) => {
    setCity('');
    setCityId('');
    console.log(state, '1')
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

  const handleStateSelect1 = (state) => {
    setPcity('');
    setPcityId('');
    console.log(state, '3')
    setPstate(state.label);
    setPstateId(state.value);
    setModalVisible2(false);
    setSearchText('');
    Keyboard.dismiss();  // Dismiss the keyboard explicitly
    fetchCitiesByState(state.value);
  };
  const handleCitySelect1 = (state) => {
    console.log(state, '4')
    setPcity(state.label);
    setPcityId(state.value);
    setModalVisible3(false);
    setSearchText('');
    Keyboard.dismiss();  // Dismiss the keyboard explicitly
  };


  const fetchCitiesByState = async (stateId) => {
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


  const handlePincodeChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, ''); // Allow only numeric values

    // Clear errors if any
    if (errors.ppin) {
      setErrors((prevErrors) => ({ ...prevErrors, ppin: '' }));
    }

    // Check if pincode starts with '0'
    if (numericValue.length > 0 && numericValue[0] === '0') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        ppin: 'Pincode should not start with 0',
      }));
      setPstate('');
      setPcity('');
      return; // Stop further processing
    }

    // Update pincode state
    setPpin(numericValue);

    // Validate length for fetching city/state
    if (numericValue.length === 6) {
      console.log('skdjjkdjk')
      fetchCityState(numericValue);
    } else {
      setPstate('');
      setPcity('');
      setIsStateCityEditable(false);
    }
  };

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
        // console.log(stateOptions, 'gfguk')
        setStates(stateOptions);
      }
    } catch {
      Alert.alert('Error', 'Failed to fetch state');
    }

  };

  const fetchCityState = async (pincode) => {
    try {
      const res = await HTTPRequest.allPincode({ pincode });
      if (res.status === 200) {
        const val = res.data.response_data;
        console.log(val, 'val');
        if (res.data.response_status === 1) {
          setPstate(val.State || '');
          setPcity(val.District || '');
          setPcityId(val.city_id || '');
          setPstateId(val.state_id || '');
          setIsStateCityEditable(false); // Disable dropdowns when valid data is returned
        } else {
          setPstate('');
          setPcity('');
          // console.log('gyuguk')
          setIsStateCityEditable(true); // Enable dropdowns when response_status is 0
        }
      } else {
        Alert.alert('Error', 'Invalid Pincode');
        setPstate('');
        setPcity('');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch data for the given pincode');
      setPstate('');
      setPcity('');
    }
  };

  const handlePincodeChange1 = (value) => {
    const numericValue = value.replace(/[^0-9]/g, ''); // Allow only numeric values

    // Clear errors if any
    if (errors.pin) {
      setErrors((prevErrors) => ({ ...prevErrors, pin: '' }));
    }

    // Check if pincode starts with '0'
    if (numericValue.length > 0 && numericValue[0] === '0') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        pin: 'Pincode should not start with 0',
      }));
      setState('');
      setCity('');
      return; // Stop further processing
    }

    // Update pincode state
    setPin(numericValue);

    // Validate length for fetching city/state
    if (numericValue.length === 6) {
      fetchCityState1(numericValue);
    } else {
      setState('');
      setCity('');
      setIsStateCityEditable(false);
    }
  };

  const validateFields = () => {
    const newErrors = {};

    // Check required fields
    if(isCurrent == true ){
      if (!residentType) newErrors.residentType = 'Resident type is required';

      if (!landmark || landmark.trim() === '') {
        newErrors.landmark = 'Landmark is required and cannot be blank.';
      } else {
        // Check for special characters at the beginning and elsewhere
        const landmarkRegex =/^[A-Za-z0-9\s.,/-]*$/ // First character must be alphanumeric, then others can be letters, numbers, spaces, ., and -
  
        if (!landmarkRegex.test(landmark)) {
          newErrors.landmark = 'Landmark should not start with special characters and should only contain letters, numbers, spaces, . and -';
        }
      }
  
      if (!house || house.trim() === '') {
        newErrors.house = 'House No. is required and cannot be blank.';
      } else {
        // Allow letters, numbers, spaces, ., -, ,, and /
        const landmarkRegex = /^[A-Za-z0-9\s.,\/-]*$/; // Includes the / character
  
        if (!landmarkRegex.test(house)) {
          newErrors.house = 'House No. can only contain letters, numbers, spaces, ., comma, hyphen, and slash (/).';
        }
      }
  
      if (!address || address.trim() === '') {
        newErrors.address = 'Address is required and cannot be blank.';
      } else {
        // Check for special characters at the beginning and elsewhere
        const addressRegex = /^[A-Za-z0-9][A-Za-z0-9\s.,\/-]*$/; // First character must be alphanumeric, then others can be letters, numbers, spaces, ., , /, and -
      
        if (!addressRegex.test(address)) {
          newErrors.address = 'Address should not start with special characters and should only contain letters, numbers, spaces, . and /.';
        }
      }
  
      // Check for permanent address validation with the same regex
      // if (!isSameAsCurrent) {
      //   if (!paddress || paddress.trim() === '') {
      //     newErrors.paddress = 'Permanent address is required and cannot be blank.';
      //   } else {
      //     // Check for special characters in Permanent Address
      //     const addressRegex = /^[A-Za-z0-9\s.,/-]*$/; // Allows letters, numbers, spaces, ., , and /
      //     if (!addressRegex.test(paddress)) {
      //       newErrors.paddress = 'Permanent address should only contain letters, numbers, spaces, ., and /.';
      //     }
      //   }
      // }
      
  
      // if (!isSameAsCurrent) {
      //   if (!phouse || phouse.trim() === '') {
      //     newErrors.phouse = 'House No. is required and cannot be blank.';
      //   } else {
      //     // Allow letters, numbers, spaces, ., -, ,, and /
      //     const landmarkRegex = /^[A-Za-z0-9\s.,\/-]*$/; // Includes the / character
  
      //     if (!landmarkRegex.test(phouse)) {
      //       newErrors.phouse = 'House No. can only contain letters, numbers, spaces, ., comma, hyphen, and slash (/).';
      //     }
      //   }
      // }
      // Check for other fields
      if (!pin) newErrors.pin = 'Pin code is required';
      if (!state) newErrors.state = 'State is required';
      if (!city) newErrors.city = 'City is required';
  
      // Check for permanent address details if applicable
      // if (!isSameAsCurrent && !ppin) newErrors.ppin = 'Permanent pin code is required';
      // if (!isSameAsCurrent && !pstate) newErrors.pstate = 'Permanent state is required';
      // if (!isSameAsCurrent && !pcity) newErrors.pcity = 'Permanent city is required';

    }
   

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };


  const fetchCityState1 = async (pincode) => {
    try {
      const res = await HTTPRequest.allPincode({ pincode });
      if (res.status === 200) {
        const val = res.data.response_data;
        console.log(res.data, 'val');
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


  const handleSubmit = async () => {
    if (!validateFields()) {
      return;
    }
    const payload = {
      house_no: house,
      cur_address1: address,
      cur_city: cityId,
      cur_landmark: landmark,
      cur_pincode: pin,
      cur_state: stateId,
      residencial_status: residentType,
    };
    console.log(payload, 'paylod')
    try {
      const response = await HTTPRequest.updateResidentialss(payload);
      if (response.status === 200) {
        console.log(response.data,'mmmmmmmmm')
        if (response.data.response_status === 1) {
          ToastAndroid.show('Data saved successfully!', ToastAndroid.SHORT);
          navigation.navigate('AddressProf', { status: 'Edit' });
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

  const validateFieldss = () => {
    const newErrors = {};

    // Check required fields
    if (!residentType) newErrors.residentType = 'Resident type is required';

    if (!paddress || paddress.trim() === '') {
      newErrors.paddress = 'Permanent address is required and cannot be blank.';
    } else {
      // Check for special characters in Permanent Address
      const addressRegex = /^[A-Za-z0-9\s.,\/-]+$/; // Allows letters, numbers, spaces, ., /, and -
      if (!addressRegex.test(paddress)) {
        newErrors.paddress = 'Permanent address should only contain letters, numbers, spaces, ., /, and -.';
      }
    }


    // Check for permanent address details if applicable
    if (!ppin) newErrors.ppin = 'Permanent pin code is required';
    if (!pstate) newErrors.pstate = 'Permanent state is required';
    if (!pcity) newErrors.pcity = 'Permanent city is required';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };



  const handleSubmit1 = async () => {
    if (!validateFieldss()) {
      return;
    }
    const payload = {
      perm_address: paddress,
      perm_city: pcityId,
      perm_pincode: ppin,
      perm_state:pstateId,
      residencial_status: residentType,
    };
    console.log(payload, 'paylod')
    try {
      const response = await HTTPRequest.updateResidentials(payload);
      if (response.status === 200) {
        console.log(response.data);

        if (response.data.response_status === 1) {
          ToastAndroid.show('Data saved successfully!', ToastAndroid.SHORT);

          navigation.goBack();
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
    // Show a loading indicator while checking version
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#419FB8" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container1} behavior="padding" enabled>
      <Head title="Residential Details" />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" // Ensure taps are not blocked
        >
          {status == 'View' ?
            <Text style={styles.subheader}>Please Check the following Details</Text>
            :
            <Text style={styles.subheader}>Please fill in the following instructions</Text>
          }

          {isCurrent == true ?

            <Text style={styles.label}>Current Address</Text>
            : null}
          <View style={styles.card}>
            <RNPickerSelect
              onValueChange={(value) => setResidentType(value)}
              items={residentTypes}
              style={pickerSelectStyles}
              placeholder={{ label: 'Resident Type', value: null }}
              value={residentType}
              disabled={status === 'View'}
            />
          </View>
          {errors.residentType && <Text style={styles.error}>{errors.residentType}</Text>}
          {isCurrent == true ?
            <>
              <TextInput style={styles.input} placeholder="House No/Flat No/Building Name/Society" value={house} onChangeText={setHouse} maxLength={40} editable={status !== 'View'} />
              {errors.house && <Text style={styles.error}>{errors.house}</Text>}

              <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} maxLength={40} editable={status !== 'View'} />
              {errors.address && <Text style={styles.error}>{errors.address}</Text>}

              <TextInput style={styles.input} placeholder="Nearest Landmark" value={landmark} maxLength={30} onChangeText={setLandmark} editable={status !== 'View'} />
              {errors.landmark && <Text style={styles.error}>{errors.landmark}</Text>}



              <TextInput
                style={styles.input}
                placeholder="Pin Code"
                value={pin}
                onChangeText={handlePincodeChange1}
                keyboardType="numeric"
                maxLength={6}
                editable={status !== 'View'}
              />
              {errors.pin && <Text style={styles.error}>{errors.pin}</Text>}
              {isStateCityEditable ?
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <TextInput style={styles.input} placeholder="Select State" value={state} editable={false} />
                </TouchableOpacity>
                :
                <TextInput style={styles.input} placeholder="State" value={state} editable={false} />
              }
              {errors.state && <Text style={styles.error}>{errors.state}</Text>}


              {
                isStateCityEditable ? (
                  state ? (
                    // If state is selected, allow opening the modal
                    <TouchableOpacity onPress={() => setModalVisible1(true)}>
                      <TextInput
                        style={styles.input}

                        placeholder="Select City"
                        value={city}
                        editable={false}
                      />
                    </TouchableOpacity>
                  ) : (
                    // If state is not selected, show a non-interactive input field
                    <TouchableOpacity onPress={() => Alert.alert('', 'Please Select State')}>

                      <TextInput
                        style={styles.input}
                        placeholder="Select City"
                        value={city}
                        editable={false} // Prevent editing
                      />
                    </TouchableOpacity>
                  )
                ) : (
                  // If isStateCityEditable is false, show the non-editable city field
                  <TextInput
                    style={styles.input}
                    placeholder="City"
                    value={city}
                    editable={false}
                  />

                )
              }

              {errors.city && <Text style={styles.error}>{errors.city}</Text>}
            </>
            : null}

       {/*   <Text style={styles.label}>Permanent Address</Text>
          {status !== 'View' && isCurrent == true && (
            <View style={styles.checkboxContainer}>
              <CheckBox value={isSameAsCurrent} onValueChange={setIsSameAsCurrent} />
              <Text style={styles.checkboxLabel}>Same as Current Address</Text>
            </View>
          )}
        */}
          {/* Conditionally render permanent address fields */}
          {/* {!isSameAsCurrent && (
            <> */}
              {/* <TextInput style={styles.input} placeholder="House No/Flat No/Building Name/Society" value={phouse} onChangeText={setPhouse} maxLength={40} editable={status !== 'View'} />
                    {errors.phouse && <Text style={styles.error}>{errors.phouse}</Text>} */}
              {/* <TextInput style={styles.input} placeholder="Address" value={paddress} onChangeText={setPaddress} maxLength={40} editable={status !== 'View'} />
              {errors.paddress && <Text style={styles.error}>{errors.paddress}</Text>}

              <TextInput
                style={styles.input}
                placeholder="Pin Code"
                value={ppin}
                onChangeText={handlePincodeChange}
                keyboardType="numeric"
                maxLength={6}
                editable={status !== 'View'}
              />
              {errors.ppin && <Text style={styles.error}>{errors.ppin}</Text>}
              {isStateCityEditable ?
                <TouchableOpacity onPress={() => setModalVisible2(true)}>
                  <TextInput style={styles.input} placeholder="Select State" value={pstate} editable={false} />
                </TouchableOpacity>
                :
                <TextInput style={styles.input} placeholder="State" value={pstate} editable={false} />
              }
              {errors.pstate && <Text style={styles.error}>{errors.pstate}</Text>}
              {
                isStateCityEditable ? (
                  pstate ? ( */}
                    {/* <TouchableOpacity onPress={() => setModalVisible3(true)}>
                      <TextInput
                        style={styles.input}

                        placeholder="Select City"
                        value={pcity}
                        editable={false}
                      />
                    </TouchableOpacity>
                  ) : (
                    // If state is not selected, show a non-interactive input field
                    <TouchableOpacity onPress={() => Alert.alert('', 'Please Select State')}>

                      <TextInput
                        style={styles.input}

                        placeholder="Select City"
                        value={pcity}
                        editable={false} // Prevent editing
                      />
                    </TouchableOpacity>
                  )
                ) : (
                  // If isStateCityEditable is false, show the non-editable city field
                  <TextInput
                    style={styles.input}

                    placeholder="City"
                    value={pcity}
                    editable={false}
                  />
                )
              }

              {errors.pcity && <Text style={styles.error}>{errors.pcity}</Text>}

            </>
          )} */}

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
          <Modal
            visible={isModalVisible2}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible2(false)} // Close on back press
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
                    <TouchableOpacity onPress={() => handleStateSelect1(item)}>
                      <Text style={styles.stateText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
                <TouchableOpacity onPress={() => setModalVisible2(false)}>
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal
            visible={isModalVisible3}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible3(false)} // Close on back press
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search City..."
                  value={searchText}
                  onChangeText={setSearchText}
                />
                <FlatList
                  data={filterCities}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleCitySelect1(item)}>
                      <Text style={styles.stateText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
                <TouchableOpacity onPress={() => setModalVisible3(false)}>
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {/* Hide the submit button if status is "View" */}
          {
            status !== 'View' && (
              isCurrent ? (
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
              )
            )
          }
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  container1: {
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subheader: {
    fontSize: 15,
    marginBottom: 20,
    color: '#7f8c8d',
    textAlign: 'center'
  },
  separator: {
    height: 2, // Increased thickness of the separator
    backgroundColor: '#ccc', // Color of the separator
    marginVertical: 20, // Increased vertical spacing between items and separator
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    width: '80%',
    backgroundColor: '#f9f9f9',
  },
  placeholder: {
    color: '#999',
    fontSize: 12,
  },
  inputText: {
    fontSize: 16,
    color: '#333',
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
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    // padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#419fb8",
    marginBottom: 12
  },
  errorInput: {
    borderColor: 'red',
  },
  separator: {
    height: 1, // Adjust the height if needed
    backgroundColor: '#ccc', // Change to your desired separator color
  },
  dropdown: {
    // height: 45,
    // borderRadius: 8,
    marginBottom: 20,
    borderColor: '#419fb8'
  },
  dropdownStyle: {
    borderRadius: 8,
    zIndex: 1000,
    borderColor: '#ccc',
    // marginTop:20,
  },
  searchTextInput: {
    borderColor: '#ccc', // Change the border color of the search input box
    borderWidth: 1, // Make sure the border is visible
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    marginTop: 5,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#419fb8',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    color: '#000'
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#419fb8', alignItems: 'center', borderRadius: 25, paddingVertical: 12, marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: 'black',
    marginBottom: 15,
  },
  inputAndroid: {
    fontSize: 14,
    // paddingVertical: 8,
    // paddingHorizontal: 10,
    // borderWidth: 1,
    // borderColor: '#ccc',
    // borderRadius: 4,
    // backgroundColor:'#f8f8f8',
    color: 'black',
    // marginBottom: 15,
  },
};

export default Address;
