// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, FlatList, ActivityIndicator } from 'react-native';
// import Head from './Header';
// import DropDownPicker from 'react-native-dropdown-picker';
// import HTTPRequest from '../utils/HTTPRequest';
// import FloatingPlaceholderInput from './FloatingPlaceholderInput';


// const Bank = ({ navigation, route }) => {
//   const { status } = route.params;
//   const [loading, setLoading] = useState(false);

//   const [ifsc, setIfsc] = useState('');
//   const [branch, setBranch] = useState('');
//   const [account, setAccount] = useState('');
//   const [caccount, setCaccount] = useState('');
//   const [bankId, setBankId] = useState(null);
//   const [bankName, setBankName] = useState('');
//   const [banks, setBanks] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [errors, setErrors] = useState({
//     ifsc: '',
//     branch: '',
//     account: '',
//     caccount: '',
//     bank: '',
//   });

//   useEffect(() => {
//     const banklist = async () => {
//       try {
//         const response = await HTTPRequest.getBankList();
//         if (response.status === 200) {
//           const bankData = response.data.response_data;
//           const bankOptions = bankData.map((bank) => ({
//             label: bank.BankName,
//             value: bank.id,
//           }));
//           setBanks(bankOptions);
//         } else {
//           // Alert.alert('Error', 'Failed to fetch bank details.');
//         }
//       } catch (error) {
//         console.error('Error fetching bank details:', error);
//         // Alert.alert('Error', 'An error occurred while fetching bank details.');
//       }
//     };

//     banklist();

//     if (status === "View" || status === "Edit") {
//       const fetchBankDetails = async (formData = { dataset: "single", type: 'bankinfo' }) => {
//         setLoading(true)
//         try {
//           const response = await HTTPRequest.getPersonal(formData);
//           if (response.status === 200) {
//             const details = response.data.response_data.bankinfo;
//             // console.log(details,'lkjkk')
//             setIfsc(details.ifsc);
//             // setBranch(details.branch_name);
//             setAccount(details.account_no);
//             setCaccount(details.account_no);
//             setBankId(details.bankid);
//           } else {
//             // Alert.alert('Error', 'Failed to fetch bank details.');
//           }
//         } catch (error) {
//           console.error('Error fetching bank details:', error);
//           // Alert.alert('Error', 'An error occurred while fetching bank details.');
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchBankDetails();
//     }
//   }, [status]);

//   // Handling changes for input fields



//   const handleIfscChange = (value) => {
//     const ifscCode = (value || '').toUpperCase();
//     setIfsc(ifscCode);

//     const isValidLength = ifscCode.length === 11;
//     const isValidFormat = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode); // optional: strict IFSC format

//     if (!isValidLength) {
//       setErrors((prev) => ({
//         ...prev,
//         ifsc: '* IFSC code must be 11 characters',
//       }));
//     } else if (!isValidFormat) {
//       setErrors((prev) => ({
//         ...prev,
//         ifsc: '* Enter a valid IFSC code format',
//       }));
//     } else {
//       setErrors((prev) => ({
//         ...prev,
//         ifsc: '',
//       }));
//     }
//   };

//   const handleAccountChange = (value) => {
//     if (value.length <= 18) {  // Limit input to 18 characters
//       setAccount(value);
//       setErrors(prevErrors => ({ ...prevErrors, account: '' }));
//     }
//   };

//   // Handle Confirm Account Number Change
//   const handleCaccountChange = (value) => {
//     if (value.length <= 18) {  // Limit input to 18 characters
//       setCaccount(value);
//       setErrors(prevErrors => ({ ...prevErrors, caccount: '' }));
//     }
//   };

//   const handleSubmit = async () => {
//     if (validateInputs()) {
//       const data = banks.find((b) => b.value === bankId);
//       const payload = {
//         dataset: "single",
//         type: 'bankinfo',
//         ifsc: ifsc,
//         account_no: account,
//         bankid: bankId,
//         bank_name: data.label,
//       };
//       console.log('Submitting:', payload);
//       try {
//         const response = await HTTPRequest.postPersonal(payload);
//         if (response.status === 200) {
//           if (response.data.response_status === 1) {
//             navigation.goBack();
//           } else {
//             Alert.alert('Error', 'Failed to update');
//           }
//         } else {
//           // Alert.alert('Error', 'Failed to fetch branch details.');
//         }
//       } catch (error) {
//         console.error('Error fetching branch details:', error);
//         // Alert.alert('Error', 'An error occurred while fetching branch details.');
//       }
//       // Alert.alert('Success', 'Form submitted successfully!');
//     }
//   };



//   // Validation function
//   const validateInputs = () => {
//     let isValid = true;
//     const newErrors = { ...errors };

//     if (!ifsc || ifsc.trim() === '') {
//       newErrors.ifsc = 'IFSC code is required';
//       isValid = false;
//     } else if (!/^[A-Za-z0-9]+$/.test(ifsc)) {
//       newErrors.ifsc = 'IFSC code should only contain alphanumeric characters';
//       isValid = false;
//     } else {
//       newErrors.ifsc = ''; // Clear error if valid
//     }

//     if (!ifsc || !/^[A-Za-z0-9]+$/.test(ifsc)) {
//       newErrors.ifsc = 'IFSC code should only contain alphanumeric characters and cannot be empty.';
//       isValid = false;
//     } else if (ifsc.length < 11) {
//       newErrors.ifsc = 'IFSC code must be 11 characters long';
//       isValid = false;
//     } else if (!/[A-Za-z]/.test(ifsc) || !/[0-9]/.test(ifsc)) {
//       newErrors.ifsc = 'IFSC code must contain letters and  numbers.';
//       isValid = false;
//     } else {
//       newErrors.ifsc = ''; // Clear error if IFSC code is valid
//     }

//     // Account number validation
//     if (!account) {
//       newErrors.account = 'Account number is required';
//       isValid = false;
//     } else if (account.length < 9 || account.length > 18) {
//       newErrors.account = 'Account number should range from 9 to 18 digits';
//       isValid = false;
//     } else if (!/^\d+$/.test(account)) { // Ensure account number contains only digits
//       newErrors.account = 'Account number should only contain digits';
//       isValid = false;
//     } else {
//       newErrors.account = '';
//     }

//     // Confirm account number matches
//     if (account !== caccount) {
//       newErrors.caccount = 'Account numbers do not match';
//       isValid = false;
//     } else {
//       newErrors.caccount = '';
//     }

//     // Bank ID validation
//     if (!bankId) {
//       newErrors.bank = 'Bank selection is required';
//       isValid = false;
//     } else {
//       newErrors.bank = '';
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   // Render the input fields

//   const renderInputField = (placeholder, value, onChangeText, keyboardType = 'default', error, editable = true, maxLength = 18, secureTextEntry = false, autoCapitalize,
//     autoCorrect) => (
//     <>
//       <TextInput
//         style={styles.input}
//         placeholder={placeholder}
//         value={value}
//         onChangeText={onChangeText}
//         keyboardType={keyboardType}
//         editable={editable}
//         selectTextOnFocus={editable}
//         maxLength={maxLength}  // Limit input length
//         secureTextEntry={secureTextEntry}  // This will hide text for password fields
//         autoCapitalize={autoCapitalize}
//         autoCorrect={autoCorrect}
//       />
//       {error ? <Text style={styles.errorText}>{error}</Text> : null}
//     </>
//   );



//   if (loading) {
//     // Show a loading indicator while checking version
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#419FB8" />
//       </View>
//     );
//   }

//   return (
//     <KeyboardAvoidingView
//       style={styles.container1}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
//       keyboardShouldPersistTaps="handled" // Ensure taps are not blocked

//     >
//       <Head title="Salary Account Details" />
//       <Text style={[styles.boldText, { textAlign: 'center', marginTop: 15, fontSize: 16, fontWeight: 'bold' }]}>
//         {status === "View" ? "Please check the Banking Details" : "Please select your Salary Account and share the bank statement for the last 3 months. This is required to verify your salary."}
//       </Text>

//       <View style={styles.formContainer}>
//         {/* Bank Dropdown with Search Inside */}
//         <Text style={styles.label1}>Select Bank (where your Salary is credited)</Text>

//         <DropDownPicker
//           open={open}
//           value={bankId}
//           items={banks}
//           setOpen={setOpen}
//           setValue={setBankId}
//           setItems={setBanks}
//           placeholder="Select Bank"
//           style={styles.dropdown}
//           dropDownContainerStyle={styles.dropdownStyle}
//           searchable={true} // Enables search inside the dropdown
//           searchablePlaceholder="Search Bank"
//           searchableError="No results found"
//           disabled={status === "View"}
//           searchTextInputStyle={styles.searchTextInput} // Apply custom style to the search box
//           separatorStyle={styles.separator} // Apply custom style to the separator
//         />
//         {errors.bank ? <Text style={styles.errorText}>{errors.bank}</Text> : null}

//         {/* Input Fields */}
//         <FlatList
//           data={[
//             { key: 'ifsc', label: 'IFSC Code' },
//             // { key: 'branch', label: 'Branch Name' },
//             { key: 'account', label: 'Account No. (where your Salary is credited)' },
//             { key: 'caccount', label: 'Re-Enter Account No.' }
//           ]}
//           keyExtractor={(item) => item.key}
//           renderItem={({ item }) => (
//             <View>
//               <Text style={styles.label1}>{item.label}</Text>
//               {item.key === 'ifsc' &&
//                 renderInputField('Enter IFSC Code', ifsc, handleIfscChange, 'visible-password', errors.ifsc, status === "Edit", 11, 'characters', false)}
//               {/* {item.key === 'branch' &&
//         renderInputField('Branch Name', branch, setBranch, 'default', errors.branch, status === "Edit", 500)} */}
//               {item.key === 'account' &&
//                 renderInputField('Enter Account No.', account, handleAccountChange, 'numeric', errors.account, status === "Edit", 18, true)}
//               {item.key === 'caccount' &&
//                 renderInputField('Re-Enter Account No', caccount, handleCaccountChange, 'numeric', errors.caccount, status === "Edit", 18)}
//             </View>
//           )}
//         />
//       </View>

//       {/* Submit Button */}
//       {status === "Edit" && (
//         <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//           <Text style={styles.buttonText}>Submit</Text>
//         </TouchableOpacity>
//       )}
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container1: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   separator: {
//     height: 1, // Adjust the height if needed
//     backgroundColor: '#ccc', // Change to your desired separator color
//   },
//   inputContainer: {
//     marginBottom: 10,
//   },
//   formContainer: {
//     flexGrow: 1,
//     paddingHorizontal: 15,
//     marginBottom: 10,
//     paddingVertical: 25,
//   },
//   input: {
//     height: 45,
//     borderWidth: 1,
//     borderColor: '#419fb8',
//     borderRadius: 8,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//   },
//   dropdown: {
//     // height: 45,
//     // borderRadius: 8,
//     marginBottom: 20,
//     borderColor: '#419fb8'
//   },
//   dropdownStyle: {
//     borderRadius: 8,
//     zIndex: 1000,
//     borderColor: '#ccc',
//     // marginTop:20,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//     color: '#333',
//   },
//   label1: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginBottom: 5,
//     color: '#333',
//   },
//   searchTextInput: {
//     borderColor: '#ccc', // Change the border color of the search input box
//     borderWidth: 1, // Make sure the border is visible
//     borderRadius: 8,
//     paddingHorizontal: 10,
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 12,
//     marginTop: 8,
//     marginBottom: 10
//   },
//   submitButton: {
//     backgroundColor: '#419fb8',
//     borderRadius: 20,
//     // marginTop: 20,
//     marginHorizontal: 20,
//     paddingVertical: 10,
//     marginBottom: '5%'
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     textAlign: 'center',
//   },
// });

// export default Bank;



import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Head from './Header';
import DropDownPicker from 'react-native-dropdown-picker';
import HTTPRequest from '../utils/HTTPRequest';

const Bank = ({ navigation, route }) => {
  const { status } = route.params;
  const [loading, setLoading] = useState(false);

  const [ifsc, setIfsc] = useState('');
  const [account, setAccount] = useState('');
  const [caccount, setCaccount] = useState('');
  const [bankId, setBankId] = useState(null);
  const [banks, setBanks] = useState([]);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({
    ifsc: '',
    account: '',
    caccount: '',
    bank: '',
  });

  useEffect(() => {
    const fetchBankList = async () => {
      try {
        const response = await HTTPRequest.getBankList();
        if (response.status === 200) {
          const bankData = response.data.response_data;
          const bankOptions = bankData.map((bank) => ({
            label: bank.BankName,
            value: bank.id,
          }));
          setBanks(bankOptions);
        }
      } catch (error) {
        console.error('Error fetching bank list:', error);
      }
    };

    fetchBankList();

    if (status === 'View' || status === 'Edit') {
      const fetchBankDetails = async () => {
        setLoading(true);
        try {
          const response = await HTTPRequest.getPersonal({ dataset: 'single', type: 'bankinfo' });
          if (response.status === 200) {
            const details = response.data.response_data.bankinfo;
            setIfsc(details.ifsc);
            setAccount(details.account_no);
            setCaccount(details.account_no);
            setBankId(details.bankid);
          }
        } catch (error) {
          console.error('Error fetching bank details:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchBankDetails();
    }
  }, [status]);

  const handleIfscChange = (value) => {
    const ifscCode = (value || '').toUpperCase();
    setIfsc(ifscCode);

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      setErrors((prev) => ({
        ...prev,
        ifsc: '* Enter a valid IFSC code format (e.g., ABCD0123456)',
      }));
    } else {
      setErrors((prev) => ({ ...prev, ifsc: '' }));
    }
  };

  const handleAccountChange = (value) => {
    if (value.length <= 18) {
      setAccount(value);
      setErrors((prev) => ({ ...prev, account: '' }));
    }
  };

  const handleCaccountChange = (value) => {
    if (value.length <= 18) {
      setCaccount(value);
      setErrors((prev) => ({ ...prev, caccount: '' }));
    }
  };

  const validateInputs = () => {
    const newErrors = {};
    let isValid = true;

    if (!ifsc || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
      newErrors.ifsc = 'Enter a valid IFSC code (11 characters, e.g., ABCD0123456)';
      isValid = false;
    }

    if (!account) {
      newErrors.account = 'Account number is required';
      isValid = false;
    } else if (!/^\d{9,18}$/.test(account)) {
      newErrors.account = 'Account number should be 9 to 18 digits';
      isValid = false;
    }

    if (account !== caccount) {
      newErrors.caccount = 'Account numbers do not match';
      isValid = false;
    }

    if (!bankId) {
      newErrors.bank = 'Bank selection is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    const bank = banks.find((b) => b.value === bankId);
    const payload = {
      dataset: 'single',
      type: 'bankinfo',
      ifsc,
      account_no: account,
      bankid: bankId,
      bank_name: bank?.label || '',
    };

    try {
      const response = await HTTPRequest.postPersonal(payload);
      if (response.status === 200 && response.data.response_status === 1) {
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to update');
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', 'An error occurred while submitting the form.');
    }
  };

  const renderInputField = (
    placeholder,
    value,
    onChangeText,
    keyboardType = 'default',
    error,
    editable = true,
    maxLength = 18,
    secureTextEntry = false,
    autoCapitalize = 'none',
    autoCorrect = true
  ) => (
    <>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        editable={editable}
        selectTextOnFocus={editable}
        maxLength={maxLength}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#419FB8" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container1}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <Head title="Salary Account Details" />
      <Text style={styles.headerText}>
        {status === 'View'
          ? 'Please check the Banking Details'
          : 'Please select your Salary Account and share the bank statement for the last 3 months. This is required to verify your salary.'}
      </Text>

      <View style={styles.formContainer}>
        <Text style={styles.label1}>Select Bank (where your Salary is credited)</Text>
        <DropDownPicker
          open={open}
          value={bankId}
          items={banks}
          setOpen={setOpen}
          setValue={setBankId}
          setItems={setBanks}
          placeholder="Select Bank"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownStyle}
          searchable
          searchablePlaceholder="Search Bank"
          searchableError="No results found"
          disabled={status === 'View'}
          searchTextInputStyle={styles.searchTextInput}
          separatorStyle={styles.separator}
        />
        {errors.bank ? <Text style={styles.errorText}>{errors.bank}</Text> : null}

        <FlatList
          data={[
            { key: 'ifsc', label: 'IFSC Code' },
            { key: 'account', label: 'Account No. (where your Salary is credited)' },
            { key: 'caccount', label: 'Re-Enter Account No.' },
          ]}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <View>
              <Text style={styles.label1}>{item.label}</Text>
              {item.key === 'ifsc' &&
                renderInputField(
                  'Enter IFSC Code',
                  ifsc,
                  handleIfscChange,
                  'visible-password',
                  errors.ifsc,
                  status === 'Edit',
                  11,
                  false,
                  'characters',
                  false
                )}
              {item.key === 'account' &&
                renderInputField(
                  'Enter Account No.',
                  account,
                  handleAccountChange,
                  'numeric',
                  errors.account,
                  status === 'Edit',
                  18
                )}
              {item.key === 'caccount' &&
                renderInputField(
                  'Re-Enter Account No',
                  caccount,
                  handleCaccountChange,
                  'numeric',
                  errors.caccount,
                  status === 'Edit',
                  18
                )}
            </View>
          )}
        />
      </View>

      {status === 'Edit' && (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    flexGrow: 1,
    paddingHorizontal: 15,
    marginBottom: 10,
    paddingVertical: 25,
  },
  headerText: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#419fb8',
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  dropdown: {
    marginBottom: 20,
    borderColor: '#419fb8',
  },
  dropdownStyle: {
    borderRadius: 8,
    zIndex: 1000,
    borderColor: '#ccc',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
  },
  label1: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  searchTextInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#419fb8',
    borderRadius: 20,
    marginHorizontal: 20,
    paddingVertical: 10,
    marginBottom: '5%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Bank;
