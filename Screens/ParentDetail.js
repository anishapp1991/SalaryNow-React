import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, FlatList, ToastAndroid, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Head from './Header';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import EncryptedStorage from 'react-native-encrypted-storage';
import HTTPRequest from '../utils/HTTPRequest';
import FloatingPlaceholderInput from './FloatingPlaceholderInput';

const ParentDetails = ({ navigation, route }) => {
  const [loanId, setLoanId] = useState(route?.params?.loans || '');
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [keyboardType, setKeyboardType] = useState('default');
  const [marital, setMarital] = useState('');
  const [maritals, setMaritals] = useState([]);
  const [gender, setGender] = useState('');
  const [genders, setGenders] = useState([]);
  const [borrow, setBorrow] = useState('');
  const [panCard, setPanCard] = useState('');
  const [addhar, setAddhar] = useState('');
  const [occupation, setOccupation] = useState('');
  const [religion, setReligion] = useState('');
  const [religions, setReligions] = useState([]);
  const [address, setAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [salary, setSalary] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    dateOfBirth: '',
    marital: '',
    gender: '',
    borrow: '',
    panCard: '',
    addhar: '',
    occupation: '',
    religion: '',
    address: '',
    pinCode: '',
    salary: '',
  });

  useEffect(() => {
    const fetchStoredData = async () => {
      try {
        const storedCommon = await EncryptedStorage.getItem('commonList');
        const commonData = JSON.parse(storedCommon);
        const genderOptions = commonData.commonList.gender.map((type) => ({
          label: type.name,
          value: type.id,
        }));
        setGenders(genderOptions);

        const maritalOptions = commonData.commonList.marital.map((type) => ({
          label: type.name,
          value: type.id,
        }));
        setMaritals(maritalOptions)

      } catch (error) {
        console.error('Failed to fetch stored data', error);
      }finally{
        setLoading(false);
      }
    };
    fetchDesignation();
    fetchStoredData();

  }, []);



  const fetchDesignation = async () => {
    try {
      setLoading(true);
      const response = await HTTPRequest.getReligion();
      if (response.status === 200) {
        console.log(response.data.response_data)
        var desig = response.data.response_data;
        const salaryOptions = desig.map((type) => ({
          label: type.name,
          value: type.r_id,
        }));
        setReligions(salaryOptions);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching user data');
    }
  }


  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDateOfBirth(formattedDate);
    }
  };

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);


  const validateFields = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Name is required';
    if (!dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required';
    if (!marital) newErrors.designation = 'marital status is required';
    if (!gender) newErrors.email = 'gender is required';
    if (!borrow) newErrors.address = 'borrower is required';
    if (!panCard) newErrors.pinCode = 'panCard is required';
    if (!addhar) newErrors.state = 'addhar is required';
    if (!occupation) newErrors.city = 'occupation is required';
    if (!religion) newErrors.education = 'religion is required';
    if (!address) newErrors.modeSalary = 'address is required';
    if (!pinCode) newErrors.salaryType = 'pinCode is required';
    const salaryRegex = /^(?!0{4})(?!0[1-9])[0-9]{1,6}$/; // Ensures valid salary patterns
  if (!salary) {
    newErrors.salary = 'Salary is required';
  } else if (!salaryRegex.test(salary)) {
    newErrors.salary = 'Invalid salary format';
  }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (validateFields()) {
      const payload = {
        loanId:loanId,
        name: name,
        dob: dateOfBirth,
        gender: gender,
        marital_status: marital,
        relation_borrower: borrow,
        pan_no: panCard,
        aadhar_no: addhar,
        occupation: occupation,
        religion: religion,
        address: address,
        pincode: pinCode,
        income: salary,
      };

      console.log('Payload:', payload);

      try {
        const response = await HTTPRequest.microUserSave(payload);
        if (response.status === 200) {
          console.log(response.data, 'sssss');
          ToastAndroid.show('Data submitted successfully!', ToastAndroid.SHORT);
          navigation.navigate('Agreement',{loan:loanId});
        } else {
          Alert.alert('Error', 'Failed to submit data');
        }
      } catch (error) {
        console.error('Error occurred during submission:', error);
        Alert.alert('Error', 'An error occurred while submitting data');
      }
    } else {
      console.log('Validation errors:', errors);
    }
  }
  const validatePan = () => {
    let errors = {};
    if (panNumber.length < 10) {
      errors.panNumber = 'PAN Number must be 10 characters';
    }
    setErrors(errors);
  };


const handlePanChange = (value) => {
    // Limit the input to 10 characters
    if (value.length > 10) return;

    // Adjust the keyboard type based on length
    let keyboardType = 'default';
    if (value.length < 5 || value.length === 9) {
      keyboardType = 'default';
    } else if (value.length >= 5 && value.length < 9) {
      keyboardType = 'numeric';
    }

    // Update the pan number and the keyboardType
    if (value.length <= 5) {
      if (/^[A-Za-z]*$/.test(value)) {
        setPanCard(value.toUpperCase());
      }
    } else if (value.length > 5 && value.length <= 9) {
      const firstPart = panCard.slice(0, 5);
      const lastPart = value.slice(5);
      if (/^\d*$/.test(lastPart)) {
        setPanCard(firstPart + lastPart);
      }
    } else if (value.length === 10) {
      const firstPart = panCard.slice(0, 9);
      const lastChar = value[9];
      if (/^[A-Za-z]$/.test(lastChar)) {
        setPanCard(firstPart + lastChar.toUpperCase());
      }
    }

    // Dynamically set keyboardType (if you want this logic to work, you may pass this as a state)
    setKeyboardType(keyboardType);
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
    <View style={styles.container1}>
      <Head title="Family Details" />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.subtitle}>
            Please fill in the following details
          </Text>

          {/* Company Name Input */}
          <View style={styles.form}>
            <FloatingPlaceholderInput
              placeholder="Full Name (As per PAN Card)"
              value={name}
              onChangeText={setName}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <FloatingPlaceholderInput
                style={[errors.dateOfBirth && styles.inputError]}
                placeholder="Date of Birth"
                value={dateOfBirth} // Display the selected date
                editable={false} // Input is not editable directly
              />
            </TouchableOpacity>
            {errors.dateOfBirth && <Text style={styles.errorText}>{errors.dateOfBirth}</Text>}

            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth ? new Date(dateOfBirth) : new Date()} // Use current date if dateOfBirth is empty
                mode="date"
                display="default"
                maximumDate={maxDate}
                onChange={onDateChange} // Handle date selection
              />
            )}
            <View style={styles.card}>
              <RNPickerSelect
                onValueChange={(value) => setMarital(value)}
                items={maritals}
                style={pickerSelectStyles}
                placeholder={{ label: 'Marital Status', value: null }}
                value={marital}
              />
            </View>
            {errors.marital && <Text style={styles.errorText}>{errors.marital}</Text>}

            <View style={styles.card}>
              <RNPickerSelect
                onValueChange={(value) => setGender(value)}
                items={genders}
                style={pickerSelectStyles}
                placeholder={{ label: 'Gender', value: null }}
                value={gender}
              />
            </View>
            {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

            <FloatingPlaceholderInput
              placeholder="Relation with Borrower"
              value={borrow}
              onChangeText={setBorrow}
            />
            {errors.borrow && <Text style={styles.errorText}>{errors.borrow}</Text>}

            <FloatingPlaceholderInput
              // style={styles.input}
              placeholder="PAN Card No."
              value={panCard}
              onChangeText={handlePanChange}
        maxLength={10}
        keyboardType={keyboardType}  // Dynamically changing keyboard type
        autoCapitalize="characters"
        onBlur={validatePan}


            />
            {errors.panCard && <Text style={styles.errorText}>{errors.panCard}</Text>}

            <FloatingPlaceholderInput
              placeholder="Aadhaar Card No."
              value={addhar}
              onChangeText={setAddhar}
              keyboardType="numeric"
              maxLength={12}
            />
            {errors.addhar && <Text style={styles.errorText}>{errors.addhar}</Text>}

            <FloatingPlaceholderInput
              placeholder="Occupation"
              value={occupation}
              onChangeText={setOccupation}
            />
            {errors.occupation && <Text style={styles.errorText}>{errors.occupation}</Text>}

            <View style={styles.card}>
              <RNPickerSelect
                onValueChange={(value) => setReligion(value)}
                items={religions}
                style={pickerSelectStyles}
                placeholder={{ label: 'Religion', value: null }}
                value={religion}
              />
            </View>
            {errors.religion && <Text style={styles.errorText}>{errors.religion}</Text>}

            <FloatingPlaceholderInput
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
            />
            {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

            <FloatingPlaceholderInput
              placeholder="Pin Code"
              value={pinCode}
              onChangeText={setPinCode}
              keyboardType="numeric"
              maxLength={6}
            />
            {errors.pinCode && <Text style={styles.errorText}>{errors.pinCode}</Text>}

            <FloatingPlaceholderInput
              placeholder="Income Earning"
              value={salary}
              onChangeText={setSalary}
              keyboardType="numeric"
              maxLength={6}
            />
            {errors.salary && <Text style={styles.errorText}>{errors.salary}</Text>}
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              { backgroundColor: '#0288D1' } // Enable if conditions are met
            ]}
            onPress={handleContinue}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
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
    // marginBottom: 12
    color: '#419fb8'
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
    marginVertical: 10,    // Adds some spacing for better readability
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    color: '#000'
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 10,
    marginTop: -10, // Align closer to the input box
    marginBottom: 10,
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
export default ParentDetails;
