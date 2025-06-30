import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, FlatList, ToastAndroid, ActivityIndicator, Modal, Keyboard, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Head from './Header';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import EncryptedStorage from 'react-native-encrypted-storage';
import HTTPRequest from '../utils/HTTPRequest';
import CheckBox from '@react-native-community/checkbox';
import FloatingPlaceholderInput from './FloatingPlaceholderInput';
import { debounce } from 'lodash'; // Import debounce
import Ionicons from 'react-native-vector-icons/Ionicons';

const Information = ({ navigation }) => {
  const route = useRoute();
  const { status } = route.params; // Get status from route params

  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [designations, setDesignations] = useState([]);
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [salary, setSalary] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [employmentType, setEmploymentType] = useState('');
  const [education, setEducation] = useState([]);
  const [educations, setEducations] = useState('');
  const [modeSalary, setModeSalary] = useState('');
  const [modeSalarys, setModeSalarys] = useState([]);
  const [salaryType, setSalaryType] = useState('');
  const [salaryTypes, setSalaryTypes] = useState([]);
  const [pinCode, setPinCode] = useState('');
  const [state, setState] = useState('');
  const [states, setStates] = useState([]);
  const [citys, setCitys] = useState([]);
  const [city, setCity] = useState('');
  const [micro, setMicro] = useState(true);
  const [micro1, setMicro1] = useState(false);
  const [companyName, setCompanyName] = useState(false);
  const [stateId, setStateId] = useState('');
  const [cityId, setCityId] = useState('');
  const [other, setOther] = useState('');
  const [company, setCompany] = useState('');
  const [companys, setCompanys] = useState('');
  const [cin, setCin] = useState('');
  const [comp_type, setComp_type] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible1, setModalVisible1] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isStateCityEditable, setIsStateCityEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm1, setSearchTerm1] = useState('');
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [hasFetchedSuggestions, setHasFetchedSuggestions] = useState(false);
  const [companyId, setCompanyId] = useState('');

  const [errors, setErrors] = useState({
    name: '',
    designation: '',
    email: '',
    address: '',
    salary: '',
    dateOfBirth: '',
    pinCode: '',
    state: '',
    city: '',
    education: '',
    modeSalary: '',
    salaryType: '',
    other: '',
    companys: '',
  });

  useEffect(() => {
    let isCancelled = false;

    if (searchTerm1.length >= 3) {
      setLoadingSuggestions(true); // ⬅️ Start loading

      const fetchSuggestions = async () => {
        try {
          const response = await HTTPRequest.searchCompany({ search: searchTerm1 });
          if (!isCancelled) {
            console.log(response.data.data)
            setSuggestions(response.data.data);
            setHasFetchedSuggestions(true);
          }
        } catch (error) {
          console.error('Failed to fetch company suggestions:', error);
          if (!isCancelled) {
            setSuggestions([]);
            setHasFetchedSuggestions(true);
          }
        } finally {
          if (!isCancelled) {
            setLoadingSuggestions(false); // ⬅️ Stop loading
          }
        }
      };

      fetchSuggestions();
    } else {
      setSuggestions([]);
      setHasFetchedSuggestions(false);
      setLoadingSuggestions(false);
    }

    return () => {
      isCancelled = true;
    };
  }, [searchTerm1]);

  useEffect(() => {
    const fetchStoredData = async () => {
      try {
        const storedCommon = await EncryptedStorage.getItem('commonList');
        const storedSalary = await EncryptedStorage.getItem('salaryMode');
        const storedEmployment = await EncryptedStorage.getItem('employmentType');

        const commonData = JSON.parse(storedCommon);
        const salaryData = JSON.parse(storedSalary);
        const employmentData = JSON.parse(storedEmployment);

        const educationOptions = commonData.commonList.qualification.map((type) => ({
          label: type.name,
          value: type.name,
        }));
        setEducation(educationOptions);

        const salaryOptions = salaryData.salaryMode.map((type) => ({
          label: type.name,
          value: type.salary_mode_id,
        }));
        setModeSalarys(salaryOptions);

        const employmentOptions = employmentData.employmentType.map((type) => ({
          label: type.name,
          value: type.employment_type_id,
        }));
        setSalaryTypes(employmentOptions);
      } catch (error) {
        console.error('Failed to fetch stored data', error);
      }
    };
    fetchUserData();
    fetchDesignation();
    fetchStoredData();
    fetchState();

  }, []);

  useEffect(() => {
    if (status === 'View') {
      fetchUserData();
    }
  }, [status]);

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


  const handleStateSelect = (state) => {
    // console.log(state, '1')
    setState(state.label);
    setStateId(state.value);
    setModalVisible(false);
    setSearchText('');
    Keyboard.dismiss();  // Dismiss the keyboard explicitly
    fetchCitiesByState(state.value);
  };
  const handleCitySelect = (state) => {
    // console.log(state, '2')
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



  const fetchDesignation = async () => {
    try {
      const response = await HTTPRequest.getDesignation();
      if (response.status === 200) {
        // console.log(response.data.response_data.designation)
        var desig = response.data.response_data.designation;
        const salaryOptions = desig.map((type) => ({
          label: type.name,
          value: type.name,
        }));
        setDesignations(salaryOptions);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching user data');
    }
  }

  const fetchUserData = async (formData = { dataset: "single", type: 'professional' }) => {

    setLoading(true)
    try {
      const response = await HTTPRequest.getPersonal(formData);
      if (response.status === 200) {
        const userData = response.data.response_data.professional;
        console.log(userData, 'userData');
        var micro = userData.micro_status == '0' ? false : true;
        setName(userData.company_name);
        setCompanyId(userData.risku);
        setDesignation(userData.designation);
        setSalary(userData.salary.toString());
        setDateOfBirth(userData.salary_date);
        setModeSalary(userData.salary_mode);
        setMicro(micro)
        // Check if the designation is 'Other'
        if (userData.designation === 'Other') {
          setOther(userData.otherdesignation || ''); // If there's an 'other' designation, set it.
        }
      } else {
        Alert.alert('Error', 'Failed to fetch user data');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching user data');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Close the date picker
    if (event.type === 'set' && selectedDate) {
      // User selected a date
      const day = selectedDate.getDate();
      const month = selectedDate.getMonth() + 1; // Get month (0-based index, so add 1)
      const year = selectedDate.getFullYear();

      // Format as dd-mm-yyyy (ensure two digits for day and month)
      const formattedDate = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;
      setDateOfBirth(formattedDate); // Set the formatted date
    } else if (event.type === 'dismissed') {
      // User pressed 'Cancel', clear the selected date
      setDateOfBirth(''); // No date selected
    }
  };

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

  const validateFields = () => {
    const newErrors = {};
    const companyNameRegex = /^[A-Za-z][A-Za-z\s.]*$/;
    // First character must be a letter, followed by letters, spaces, or dots.

    if (!name || name.trim() === '') {
      newErrors.name = 'Company Name is required and cannot be blank.';
    }
    if (!designation) newErrors.designation = 'Designation is required';
    if (!salary) {
      newErrors.salary = 'Salary is required';
    } else if (newErrors.salary) {
      newErrors.salary = formErrors.salary; // Retain the existing error
    }
    if (!dateOfBirth) newErrors.dateOfBirth = ' Salary Date is required';
    if (!modeSalary) newErrors.modeSalary = 'Mode of Salary is required';
    const otherRegex = /^(?!\s*$)[a-zA-Z0-9 ]+$/;
    if (designation === 'Other' && !other) {
      newErrors.other = 'Other designation is required';
    } else if (designation === 'Other' && !otherRegex.test(other)) {
      newErrors.other = 'Designation can only contain letters, numbers, and spaces, with no special characters, and cannot be empty or just spaces.';
    }
    if (micro1 === true) {
      if (!companys || companys.trim() === '') {
        newErrors.company = 'Company is required';
      } else if (!/^[a-zA-Z0-9][a-zA-Z0-9 .-]*$/.test(companys)) {
        newErrors.companys = 'Company should only contain alphanumerics, spaces, ".", or "-", and cannot start with a special character.';
      }
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (validateFields()) {
      var ss = micro ? '1' : '0';
      const micro_status = salary > 25000 ? 1 : ss;
      // const checkCompany = micro1 == false ? 1 : 0;
      var des = designation == 'Other' ? other : designation;

      const payload = {
        company_name: name,
        risku: companyId,
        dataset: "single",
        type: 'professional',
        designation: des,
        // otherdesignation: other,
        salary: salary,
        salary_date: dateOfBirth,
        salary_mode: modeSalary,
        micro_status: micro_status, // Add the determined value here
      };
      console.log('Payload:', payload, micro);
      setLoading(true);
      try {
        const response = await HTTPRequest.postPersonal(payload);
        // console.log(response.data, 'jjj')
        if (response.status === 200) {
          if (response.data.response_status == 1) {
            // console.log(response.data, 'sssss');
            ToastAndroid.show('Data submitted successfully!', ToastAndroid.SHORT);
            navigation.goBack();
          } else {
            Alert.alert('Error', response.data.response_msg);

          }

        } else {
          Alert.alert('Error', 'Failed to submit data');
        }
      } catch (error) {
        console.error('Error occurred during submission:', error);
        Alert.alert('Error', 'An error occurred while submitting data');
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Validation errors:', errors);
    }
  };

  const fetchSuggestions = async (query) => {
    try {
      setIsLoading(true); // Start loader
      const payload = { company_name: query };
      const response = await HTTPRequest.company(payload);
      if (response.status === 200) {
        // console.log(typeof response.data.response_status)
        if (response.data.response_status == 1) {
          setSuggestions(response.data.response_data.data.company_list);
        } else {
          setName(query)
          setCompanyName(true)
          setCompanys('')
          Alert.alert(
            "Company Not Found",
            `The company (${name}) is not available in our database. You can try searching again or check the box to manually enter your company name.`
          );
        }

      } else {
        Alert.alert("Error", "Failed to fetch suggestions. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while fetching suggestions.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = () => {
    Keyboard.dismiss(); // Dismiss the keyboard
    if (name.length > 3) {
      setShowDropdown(true);
      setSuggestions([]); // Clear previous suggestions
      fetchSuggestions(name);  // Call the debounced function to fetch new suggestions
    } else {
      Alert.alert("Enter atleast 4 letters")
      setShowDropdown(false);
      setSuggestions([]); // Clear suggestions if input is too short
    }
  };

  const handleEditChange = () => {
    setCompanys('');
    setCompanyName(false);
    setMicro1(false);
  };

  const handleSelect = (item) => {
    // console.log(item, 'item')
    setName(item.company_name);
    setCompanys(item.company_name)
    setCin(item.cin_number);
    setComp_type(item.company_type);
    setCompanyName(false)
    setShowDropdown(false);
  };

  if (loading) {
    // Show a loading indicator while checking version
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#419FB8" />
      </View>
    );
  }

  if (isLoading) {
    // Show a loading indicator while checking version
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: "#0000ff" }} >Searching for {name}</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }


  const handleSalaryChange = (value) => {
    // Remove any non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');

    // Check if the salary starts with '0'
    if (numericValue.length > 0 && numericValue[0] === '0') {
      setErrors({ salary: 'Salary cannot start with 0' });
    } else {
      setErrors({ salary: '' }); // Clear error
    }

    // Update the salary value if it's valid (no leading zero)
    if (numericValue.length <= 6) {
      setSalary(numericValue); // Update salary if it's valid
    }
  };

  return (
    <View style={styles.container1}>
      <Head title="Professional Information" />
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" // Ensure taps are not blocked
        >
          <Text style={styles.subtitle}>
            {status === 'Edit' ? 'Please fill in the following details' : 'Please Check the Following Details'}
          </Text>

          {/* Company Name Input */}
          <View style={styles.form}>
            <View style={styles.mobileContainer}>


              <TextInput
                style={styles.input}
                placeholder="Search your company name"
                value={isTyping ? searchTerm1 : name}
                onChangeText={(text) => {
                  setSearchTerm1(text);
                  setIsTyping(true);

                  if (text.trim() === '') {
                    setName('');
                    setCompanyId(''); // ⬅️ Clear ID too
                    setSuggestions([]);
                    return;
                  }
                }}
                maxLength={50}
                multiline={true}
                numberOfLines={2}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

              {isTyping && searchTerm1.trim().length >= 3 && (
                <ScrollView style={styles.scrollContainer1} nestedScrollEnabled={true}>
                  <View style={styles.suggestionList1}>
                    {loadingSuggestions ? (
                      <ActivityIndicator size="small" color="#000" style={{ marginVertical: 10 }} />
                    ) : (
                      <>
                        {hasFetchedSuggestions && (
                          <TouchableOpacity
                            onPress={() => {
                              setName(searchTerm1);
                              setCompanyId('0'); // ⬅️ No ID if manually typed
                              setSearchTerm1('');
                              setSuggestions([]);
                              setIsTyping(false);
                            }}
                            style={styles.suggestionItem1}
                          >
                            <Text style={styles.suggestionText1}>
                              Continue with "{searchTerm1}"
                            </Text>
                          </TouchableOpacity>
                        )}

                        {/* Updated Suggestions */}
                        {Array.isArray(suggestions) && suggestions.length > 0 &&
                          suggestions.map((item) => (
                            <TouchableOpacity
                              key={item.id}
                              onPress={() => {
                                setName(item.company_name);
                                setCompanyId(item.id);
                                setSearchTerm1('');
                                setSuggestions([]);
                                setIsTyping(false);
                              }}
                              style={styles.suggestionItem1}
                            >
                              <Text style={styles.suggestionText1}>{item.company_name}</Text>
                            </TouchableOpacity>
                          ))
                        }
                      </>
                    )}
                  </View>
                </ScrollView>
              )}

            </View>

            <View style={styles.card}>
              <RNPickerSelect
                onValueChange={(value) => setDesignation(value)}
                items={designations}
                style={pickerSelectStyles}
                placeholder={{ label: 'Select Your Designation', value: null }}
                value={designation}
                disabled={status !== 'Edit'} // Disable picker if status is not 'Edit' or company name is empty
              />
            </View>
            {errors.designation && <Text style={styles.errorText}>{errors.designation}</Text>}

            {designation === 'Other' && status === 'View' && ( // Only show if company name is provided
              <TextInput
                style={styles.input}
                placeholder="Designation"
                value={other}
                editable={false}  // Disable input in 'View' mode
              />
            )}

            {designation === 'Other' && status === 'Edit' && ( // Only show if company name is provided
              <TextInput
                style={styles.input}
                placeholder="Enter Designation"
                value={other}
                onChangeText={setOther}
              />
            )}

            {errors.other && <Text style={styles.errorText}>{errors.other}</Text>}


            {/* <TextInput
              style={styles.input}

              placeholder="Company Email"
              value={email}
              onChangeText={setEmail}
              maxLength={40}
              keyboardType="email-address"
              editable={status === 'Edit'}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <TextInput
              placeholder="Address"
              style={styles.input}

              value={address}
              onChangeText={setAddress}
              maxLength={130}
              editable={status === 'Edit'}
            />
            {errors.address && <Text style={styles.errorText}>{errors.address}</Text>} */}

            <TextInput
              placeholder="Salary"
              style={styles.input}

              value={salary}
              onChangeText={handleSalaryChange} // Use the validation function
              keyboardType="numeric"
              maxLength={6}
              editable={status === 'Edit'}
            />
            {errors.salary && <Text style={styles.errorText}>{errors.salary}</Text>}

            {/* Date Picker for Salary Date */}
            <TouchableOpacity
              onPress={() => {
                if (status === 'Edit') {
                  setShowDatePicker(true);
                }
              }}
              disabled={status === 'View'} // Prevent opening the picker if not editable
            >
              <FloatingPlaceholderInput
                style={[styles.input, errors.dateOfBirth && styles.inputError]}
                placeholder=" Salary Date"
                value={dateOfBirth || ''} // Display the selected date or an empty string
                editable={false} // Input is not editable directly
              />
            </TouchableOpacity>
            {errors.dateOfBirth && <Text style={styles.errorText}>{errors.dateOfBirth}</Text>}

            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth ? new Date(dateOfBirth.split('-').reverse().join('-')) : new Date()} // Convert dd-mm-yyyy to Date object
                mode="date"
                display="default"
                onChange={onDateChange} // Handle date selection
              />
            )}
            {/* <TextInput
              placeholder="Pin Code"
              style={styles.input}

              value={pinCode}
              onChangeText={handlePincodeChange}
              keyboardType="numeric"
              maxLength={6}
              editable={status === 'Edit'}
            />
            {errors.pinCode && <Text style={styles.errorText}>{errors.pinCode}</Text>}

            {isStateCityEditable ?
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <TextInput style={[styles.input, errors.state && styles.inputError]} placeholder="Select State" value={state} editable={false} />
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
                    style={[styles.input, errors.state && styles.inputError]}
                    placeholder="Select City"
                    value={city}
                    editable={false}
                  />
                </TouchableOpacity>
              )
            ) : (
              // If isStateCityEditable is false, show the non-editable city field
              <TextInput
                style={[styles.input, errors.state && styles.inputError]}
                placeholder="City"
                value={city}
                editable={false}
              />
            )}
            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>} */}

            {/* Dropdown for Education */}
            {/* <View style={styles.card}>
              <RNPickerSelect
                onValueChange={(value) => setEducations(value)}
                items={education}
                style={pickerSelectStyles}
                placeholder={{ label: 'Education', value: null }}
                value={educations}
                disabled={status !== 'Edit'} // Disable selection based on status
              />
            </View>
            {errors.education && <Text style={styles.errorText}>{errors.education}</Text>} */}

            {/* Dropdown for Mode of Salary */}
            <View style={styles.card}>
              <RNPickerSelect
                onValueChange={(value) => setModeSalary(value)}
                items={modeSalarys}
                style={pickerSelectStyles}
                placeholder={{ label: 'Mode Of Salary', value: null }}
                value={modeSalary}
                disabled={status !== 'Edit'}
              />
            </View>
            {errors.modeSalary && <Text style={styles.errorText}>{errors.modeSalary}</Text>}

            {/* Dropdown for Employment Type */}
            {/* <View style={styles.card}>
              <RNPickerSelect
                onValueChange={(value) => setSalaryType(value)}
                items={salaryTypes}
                style={pickerSelectStyles}
                placeholder={{ label: 'Select Employment Type', value: null }}
                value={salaryType}
                disabled={status !== 'Edit'}
              />
            </View>
            {errors.salaryType && <Text style={styles.errorText}>{errors.salaryType}</Text>} */}
          </View>
          {/* Continue Button */}

          {status === 'Edit' && (
            <>
              {Number(salary) < 24999 && (
                <View style={styles.design}>
                  <CheckBox
                    value={micro}
                    onValueChange={setMicro}
                    style={styles.checkbox}
                  />
                  <Text style={styles.checkboxLabel}>
                    I confirm my family (me, spouse and unmarried children) annual income is more than Rs 300000/-.
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.continueButton,
                  { backgroundColor: '#0288D1' } // Enable if conditions are met
                ]}
                onPress={handleContinue}
              >
                <Text style={styles.continueText}>Continue</Text>
              </TouchableOpacity>


            </>
          )}

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

        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    // padding: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#419fb8",
    // marginBottom: 12,
    color: '#419fb8'
  },
  cardHeader2: {
    fontSize: 12,
    marginLeft: 8,
    color: '#ccc',
    fontWeight: 'bold',
    marginBottom: 3,
    // marginTop:3,

  },

  suggestionItem1: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText1: {
    fontSize: 14,
    color: '#333',
  },

  scrollContainer1: {
    maxHeight: 150,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    zIndex: 10, // Ensure dropdown overlays correctly
  },
  suggestionList1: {
    paddingVertical: 4,
  },


  loaderContainer: {
    position: 'absolute',
    zIndex: 2,
    top: 15,
    right: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    marginTop: 5,
    fontSize: 12,
    color: '#0000ff', // Matches the loader color
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  dropdownItem: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
  mobileContainer: {
    position: 'relative',
    width: '100%',
  },
  icon: {
    width: 20, // Adjust size of Lottie animation
    height: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  design: {
    flexDirection: 'row', // This ensures the checkbox and text are aligned horizontally
    alignItems: 'center',  // Vertically align the checkbox and text
    flexWrap: 'wrap',      // Allows text to wrap in case it overflows
    // marginVertical: 10,    // Adds some spacing for better readability
  },

  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
    maxHeight: 200, // Set a max height for the dropdown
    marginTop: 4,
    marginBottom: 10,
    overflow: 'hidden', // Ensure dropdown is scrollable
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    fontSize: 16,
  },
  checkbox: {
    marginRight: 10, // Adds space between the checkbox and the text
  },
  checkboxLabel: {
    flex: 1,          // Ensures the text can take up the remaining space
    flexWrap: 'wrap', // Allows text to wrap if it overflows
    fontSize: 14,     // Adjust text size as necessary
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    marginVertical: 20,
  },
  input1: {
    borderWidth: 1,
    borderColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    height: 63,
    color: '#000',

    // textAlign: 'left',      // Align the text to the right
    // overflow: 'hidden',      // Hide overflowed text
    // textOverflow: 'ellipsis', // Show ellipsis when text overflows
    whiteSpace: 'pre-wrap'     // Prevent text wrapping
  },
  input: {
    borderWidth: 1,
    borderColor: '#419fb8',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    color: '#000'
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 10,
    marginTop: 0, // Align closer to the input box
    marginBottom: 0,
  },
  continueButton: {
    backgroundColor: '#419fb8',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  continueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: '#fff', // Matched background color
    paddingVertical: 12, // Matched padding
    paddingHorizontal: 12, // Matched horizontal padding
    borderRadius: 8, // Same border radius
    fontSize: 14, // Same font size
    marginBottom: 10, // Matched margin
    borderWidth: 1, // Same border width
    borderColor: '#ccc', // Same border color
    color: 'black', // Matched text color
  },
  inputAndroid: {
    fontSize: 14,
    color: '#000',
  },
});
export default Information;
