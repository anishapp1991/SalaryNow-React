import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  ToastAndroid,
  Linking
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Head from './Header';
import { RNS3 } from 'react-native-aws3';
import { RNCamera } from 'react-native-camera';
import HTTPRequest from '../utils/HTTPRequest';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import ImagePicker from 'react-native-image-crop-picker';
import { useFocusEffect } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import Geolocation from 'react-native-geolocation-service';
import DropDownPicker from 'react-native-dropdown-picker';
import CheckBox from '@react-native-community/checkbox';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';  // Import Material Icons


const LoanDetailsScreen = ({ navigation, route }) => {
  const lastData = route?.params?.item;
  const [loanAmount, setLoanAmount] = useState(Number(lastData.maxAmount));
  const [product, setProduct] = useState(lastData || '');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibles, setModalVisibles] = useState(false);
  const [inputAmount, setInputAmount] = useState(loanAmount.toLocaleString('en-IN'));
  const [loading, setLoading] = useState(true);
  const [emidata, setEmidata] = useState([]);
  const [data, setData] = useState([0, 100]);
  const [keyId, setKeyId] = useState('');
  const [fullName, setFullName] = useState('');
  const [fathersName, setFathersName] = useState('');
  const [alternateNumber, setAlternateNumber] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [path, setPath] = useState('');
  const [region, setRegion] = useState('');
  const [bucket, setBucket] = useState('');
  const [personalDetailsStatus, setPersonalDetailsStatus] = useState({});
  const [reference, setReference] = useState('');
  const [isCameraVisible, setCameraVisible] = useState(false);
  const [camera, setCamera] = useState(null);
  const [buttonStatus, setButtonStatus] = useState('');
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modeSalary, setModeSalary] = useState('');
  const [modeSalarys, setModeSalarys] = useState([]);
  const [other, setOther] = useState('');
  const [designation, setDesignation] = useState('');
  const [designations, setDesignations] = useState([]);
  const [bankId, setBankId] = useState(null);
  const [bankName, setBankName] = useState('');
  const [banks, setBanks] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [salary, setSalary] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [account, setAccount] = useState('');
  const [caccount, setCaccount] = useState('');
  const [selfieUrl, setSelfieUrl] = useState('');
  const [micro, setMicro] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm1, setSearchTerm1] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [hasFetchedSuggestions, setHasFetchedSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [companyId, setCompanyId] = useState('');



  const [errors, setErrors] = useState({
    fullName: '',
    fathersName: '',
    alternateNumber: '',
    dateOfBirth: '',
    salaryType: '',
    modeSalary: '',
    name: '',
    salary: '',
    designation: '',
    other: '',
    ifsc: '',
    branch: '',
    account: '',
    caccount: '',
    bank: '',

  });
  // console.log(typeof modeSalary);

  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
        console.log(granted, 'Permission granted');
        if (granted) {
          getCurrentLocation(); // Fetch location directly
        } else {
          await requestLocationPermission(); // Request only if not already granted
        }
      } catch (error) {
        console.error('Error checking location permission:', error);
        Alert.alert('Error', 'Unable to check location permission.');
      }
    };

    checkLocationPermission();
    // fetchNewPersonal();
    fetchProductDetails();
    fetchPersonalDetails();
  }, [loanAmount]); // Fetch whenever loanAmount changes

  useFocusEffect(
    useCallback(() => {
      // Fetch data when the screen regains focus
      fetchProductDetails();
      fetchPersonalDetails();
      s3Credential();
      fetchStatusReference();
      fetchDashboard();
      fetchSelfie();
      fetchDesignation();
      banklist();
      fetchNewPersonal();
    }, [])
  );


  // useEffect(() => {
  //   if (searchTerm1.length >= 3) {
  //     console.log('Fetching suggestions...');
  //     const fetchSuggestions = async () => {
  //       try {
  //         const response = await HTTPRequest.searchCompany({
  //           search: searchTerm1, // Adjust the key if your API expects a different one
  //         });
  //         console.log(response.data);
  //         setSuggestions(response.data); // Adjust if your API wraps data
  //       } catch (error) {
  //         console.error('Failed to fetch company suggestions:', error);
  //         setSuggestions([]);
  //       }
  //     };

  //     fetchSuggestions();
  //   } else {
  //     setSuggestions([]);
  //   }
  // }, [searchTerm1]);



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





  const fetchSelfie = async () => {
    setLoading(true)
    try {
      const response = await HTTPRequest.selfie({ doctype: "selfie" });
      if (response.status === 200) {
        const details = response.data.data.front;
        console.log(details, 'details')
        if (details) {
          setSelfieUrl(details);
        }
        fetchPersonalDetails();
      } else {
        // Alert.alert('Error', 'Failed to fetch selfie.');
      }
    } catch (error) {
      console.error('Error fetching selfie:', error);
      // Alert.alert('Error', 'An error occurred while fetching selfie.');
    }
  };

  const fetchNewPersonal = async (formData = { dataset: "all" }) => {
    try {
      // Ensure formData is used correctly as query parameters
      const response = await HTTPRequest.getPersonal(formData);

      if (response && response.status === 200) {
        var personal = response.data.response_data.personal;
        var Professional = response.data.response_data.professional;
        var Banking = response.data.response_data.bankinfo;
        console.log('Data fetched successfully:', response.data.response_data);
        // console.log('Data fetched successfully:', Professional);
        var micro = Professional.micro_status == '0' ? false : true;
        console.log(micro, 'Microoo')
        setFullName(personal.fullname);
        setFathersName(personal.father_name);
        setAlternateNumber(personal.alterMobile);
        setName(Professional.company_name);
        setCompanyId(Professional.risku);
        setDesignation(Professional.designation);
        setModeSalary(Professional.salary_mode);
        setSalary(Professional.salary);
        setDateOfBirth(Professional.salary_date);
        setIfsc(Banking.ifsc);
        setAccount(Banking.account_no);
        setCaccount(Banking.account_no);
        setBankId(Banking.bankid);
        setMicro(micro);
        if (Professional.designation === 'Other') {
          setOther(Professional.otherdesignation || ''); // If there's an 'other' designation, set it.
        }
        return response.data;
      } else {
        console.error('Error in fetching data:', response?.data || "No data received");
        return null;
      }
    } catch (error) {
      console.error('Error in request:', error.message || error);
      return null;
    }
  };



  const banklist = async () => {
    try {
      const response = await HTTPRequest.getBankList();
      if (response.status === 200) {
        const bankData = response.data.response_data;
        const bankOptions = bankData.map((bank) => ({
          label: bank.BankName,
          value: bank.id,
        }));
        setBanks(bankOptions);
      } else {
        // Alert.alert('Error', 'Failed to fetch bank details.');
      }
    } catch (error) {
      console.error('Error fetching bank details:', error);
      // Alert.alert('Error', 'An error occurred while fetching bank details.');
    }
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: "Location Permission",
          message: "This app needs access to your location.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
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
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      Alert.alert('Error', 'An error occurred while requesting location permission.');
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        try {
          await EncryptedStorage.setItem('location', JSON.stringify({ latitude, longitude }));
          // console.log('Location saved to EncryptedStorage:', { latitude, longitude });
        } catch (error) {
          console.error('Error saving location to EncryptedStorage:', error);
        }

      },
      (error) => {
        console.error('Error getting location:', error);
      },
      { enableHighAccuracy: true, timeout: 3000000, maximumAge: 600000 } // Increase timeout to 60 seconds
    );
  };


  const fetchDashboard = async () => {
    const accessToken1 = await EncryptedStorage.getItem('dashboardloan');
    const storedSalary = await EncryptedStorage.getItem('salaryMode');
    const salaryData = JSON.parse(storedSalary);

    const parsedToken1 = JSON.parse(accessToken1);
    const userData = parsedToken1?.dashboardloan;

    const salaryOptions = salaryData.salaryMode.map((type) => ({
      label: type.name,
      value: type.salary_mode_id,
    }));
    setModeSalarys(salaryOptions);
    // console.log( userData.response_data.data.loan_details.loanstatus,'fghhjnj');
    setButtonStatus(userData.response_data.data.loan_details.loanstatus)
  }


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



  const fetchStatusReference = async () => {
    const response = await HTTPRequest.referenceStatus();
    try {
      if (response.status === 200) {
        // console.log(response.data.response_dialog_refrence, ' status');
        setReference(response.data.response_dialog_refrence);
      } else {
        Alert.alert('Error', 'Failed to fetch Reference Status');
      }
    } catch (error) {
      console.error('Error fetching credentials:', error);
      Alert.alert('Error', 'An error occurred while fetching credentials');
    }
  }

  const s3Credential = async () => {
    try {
      const response = await HTTPRequest.getCredential({ page: "selfie" });
      if (response.status === 200) {
        const power = response.data.data;
        setKeyId(power.IAM_KEY);
        setAccessKey(power.IAM_SECRET);
        setBucket(power.bucket);
        setPath(power.path);
        setRegion(power.region);
      } else {
        Alert.alert('Error', 'Failed to fetch Credential');
      }
    } catch (error) {
      console.error('Error fetching credentials:', error);
      Alert.alert('Error', 'An error occurred while fetching credentials');
    }
  };

  const fetchPersonalDetails = async () => {
    try {
      const response = await HTTPRequest.personal();
      if (response.status === 200) {
        const details = response.data.response_data;
        // console.log(details, 'Personal Details');
        setPersonalDetailsStatus(details);
      } else {
        Alert.alert('Error', 'Failed to fetch personal details.');
      }
    } catch (error) {
      console.error('Error fetching personal details:', error);
      // Alert.alert('Error', 'An error occurred while fetching personal details.');
    }
  };

  const fetchProductDetails = async () => {
    try {
      setInputAmount(loanAmount.toString());
      const response = await HTTPRequest.productDetails({
        product_id: product.id,
        loan_amount: loanAmount,
      });
      if (response.status === 200) {
        const ab = response.data.response_data;
        // console.log('Loan Charges:', ab);
        setData(ab);
        setEmidata(ab.emi_data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     setModalVisible(false); // Reset modal state on screen focus
  //     setModalVisibles(false);
  //     return () => {
  //       setModalVisible(false); // Cleanup on blur
  //       setModalVisibles(false);
  //     };
  //   }, [])
  // );

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const checkModalState = async () => {
  //       try {
  //         const modalState = await EncryptedStorage.getItem('modalVisible');
  //         // console.log(modalState, 'modalState');

  //         try {
  //           const response = await HTTPRequest.personal();
  //           if (response.status === 200) {
  //             const details = response.data.response_data;
  //             // console.log(details, 'Personal Details');
  //             if (modalState === 'true') {
  //               if (
  //                 details?.selfi ||
  //                 details?.address ||
  //                 details?.bank ||
  //                 details?.employeement ||
  //                 details?.personal
  //               ) {
  //                 setModalVisibles(true);
  //               }
  //             }
  //           } else {
  //             Alert.alert('Error', 'Failed to fetch personal details.');
  //           }
  //         } catch (error) {
  //           console.error('Error fetching personal details:', error);
  //           // Alert.alert('Error', 'An error occurred while fetching personal details.');
  //         }


  //       } catch (error) {
  //         console.error('Error checking modal state:', error);
  //       }
  //     };
  //     checkModalState();
  //   }, [])
  // );

  // useEffect(() => {
  //   const saveModalState = async () => {
  //     if (modalVisibles) {
  //       await EncryptedStorage.setItem('modalVisible', 'true'); // Save state as true
  //     };
  //   };
  //   saveModalState();
  // }, [modalVisibles]);


  // const handleModal = async () => {
  //   try {
  //     const response = await HTTPRequest.personal();
  //     if (response.status === 200) {
  //       const details = response.data.response_data;
  //       console.log(details, 'Personal Details');
  //       if (
  //         details?.selfi ||
  //         details?.bank ||
  //         details?.employeement ||
  //         details?.personal
  //       ) {
  //         setModalVisibles(true);
  //       } else if (reference) {
  //         navigation.navigate('Reference', { lastData, loanAmount });
  //       } else {
  //         navigation.navigate('LoanApply', { lastData, loanAmount });
  //       }
  //     } else {
  //       Alert.alert('Error', 'Failed to fetch personal details.');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching personal details:', error);
  //     // Alert.alert('Error', 'An error occurred while fetching personal details.');
  //   }
  // };




  const handleModal = async () => {
    try {
      setLoadingModal(true); // Show loader before fetch starts

      const response = await HTTPRequest.personal();

      if (response.status === 200) {
        const details = response.data.response_data;
        console.log(details, 'Personal Details');

        if (
          details?.selfi ||
          details?.bank ||
          details?.employeement ||
          details?.personal
        ) {
          await fetchNewPersonal(); // Reset form fields
          setModalVisibles(true);  // Show modal
        } else if (reference) {
          navigation.navigate('Reference', { lastData, loanAmount });
        } else {
          navigation.navigate('LoanApply', { lastData, loanAmount });
        }
      } else {
        Alert.alert('Error', 'Failed to fetch personal details.');
      }
    } catch (error) {
      console.error('Error fetching personal details:', error);
      Alert.alert('Error', 'An error occurred while fetching personal details.');
    } finally {
      setLoadingModal(false); // Hide loader regardless of success/failure
    }
  };



  const openCamera = () => {
    // setModalVisibles(false);
    setCameraVisible(true);
  }
  const closeCamera = () => setCameraVisible(false);

  const takePicture = async () => {
    if (camera) {
      try {
        const options = { quality: 0.8, base64: true };
        const data = await camera.takePictureAsync(options);
        // console.log('Captured image data:', data);
        // uploadToS3(data); // Upload the cropped image to S3
        // closeCamera();
        cropImage(data);
      } catch (error) {
        console.error('Error capturing picture:', error);
        // Alert.alert('Capture Error', 'Failed to capture the picture.');
      }
    } else {
      Alert.alert('Camera Error', 'Camera is not ready.');
    }
  };

  const cropImage = async (image) => {
    try {
      const croppedImage = await ImagePicker.openCropper({
        path: image.uri,  // Path of the captured image
        width: 300,  // Set the width for the cropped image
        height: 300,  // Set the height for the cropped image
        cropping: true,  // Enable cropping feature
        cropperCircleOverlay: true,  // Optional: Show circular crop overlay
        cropperActiveWidgetColor: '#ff6347', // Color of the cropper's widgets (optional)
      });
      console.log('Cropped image data:', croppedImage);
      uploadToS3(croppedImage); // Upload the cropped image to S3
      closeCamera();
    } catch (error) {
      console.error('Error cropping image:', error);
      Alert.alert('Crop Error', 'Could not crop the image.');
    }
  };

  const uploadToS3 = async (image) => {
    setLoading(true); // Start loading before upload
    console.log('jvhjh', image)
    const file = {
      uri: image.path,  // The file URI from camera capture
      name: 'selfie_' + image.path.split('/').pop(), // File name
      type: 'image/jpeg',  // Correct mime type for JPG
    };

    const options = {
      keyPrefix: `${path}`, // Path within your bucket from state
      bucket: bucket, // Bucket name
      region: region, // AWS region
      accessKey: keyId, // Your access key
      secretKey: accessKey, // Your secret key
      successActionStatus: 201, // HTTP status code on success
      ACL: 'public-read',
    };

    try {
      const response = await RNS3.put(file, options);
      console.log(response, 'response');
      if (response.status === 201) {
        console.log('Image uploaded successfully:', response.body);
        console.log(file.name, 'Image Name');
        await reverseGeocode(file.name);
        // Update state to mark selfie as completed
        setPersonalDetailsStatus((prev) => ({
          ...prev,
          selfi: false, // or update based on API response
        }));
        // Alert.alert('Success', 'Selfie uploaded successfully!');
      } else {
        console.error('Failed to upload image to S3:', response);
        Alert.alert('Upload Error', 'Could not upload the image to AWS S3.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Upload Error', 'Could not upload the image to AWS S3.');
    } finally {
      setLoading(false); // Stop loading after upload
    }
  };

  const reverseGeocode = async (daa) => {
    fetchPersonalDetails(); // Refresh the data
    try {

      const locationString = await EncryptedStorage.getItem('location');

      if (locationString !== null) {
        // If the item exists, parse the JSON string into an object
        const locations = JSON.parse(locationString);

        const latLng = location
          ? `${location.latitude}|${location.longitude}`
          : `${locations.latitude}|${locations.longitude}`; // Fallback if location is not available
        var imData = daa.split('/').pop()
        try {
          const selfieResponse = await HTTPRequest.postSelfie({ filename: imData, selfie_location: latLng });
          if (selfieResponse.status === 200) {
            fetchSelfie()
            console.log(selfieUrl, 'swelfie');
            ToastAndroid.show('Selfie Uploaded Successfully', ToastAndroid.SHORT);
          }
        } catch (error) {
          console.error('Error in reverse geocode or upload:', error);
          Alert.alert('Error', `An error occurred: ${error.message}`);
        }

      } else {
        console.log('No location found in EncryptedStorage');


      }
    } catch (error) {
      console.error('Error in reverse geocode or upload:', error);
      Alert.alert('Error', `An error occurred: ${error.message}`);
    }

  };




  const renderEMIRow = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.emi_month}</Text>
      <Text style={styles.tableCell}>₹{item.emi_interest}</Text>
      <Text style={styles.tableCell}>₹{item.monthly_emi_amount}</Text>
    </View>
  );

  const CustomMarker = () => (
    <View style={styles.customMarkerContainer}>
      <Image
        source={require('../assests/gold-rupee-icon.png')} // Replace with your image path
        style={styles.customMarkerImage}
      />
    </View>
  );



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

  const validateForm = () => {
    let formErrors = {};

    if (modeSalary == '1') {

      if (!fullName) {
        formErrors.fullName = '* Full Name is required';
      }
      const companyNameRegex = /^[A-Za-z\s]*$/;
      if (!fathersName.trim()) {
        formErrors.fathersName = '* Father\'s Name is required and cannot contain only spaces.';
      } else if (!companyNameRegex.test(fathersName)) {
        formErrors.fathersName = '* Father\'s Name should only contain letters and spaces.';
      }

      // Mobile Number Validation
      const mobileNumberRegex = /^[1-9][0-9]{9}$/;
      if (!alternateNumber) {
        formErrors.alternateNumber = '* Alternate Mobile is required';
      } else if (!mobileNumberRegex.test(alternateNumber)) {
        formErrors.alternateNumber = '* Invalid mobile number (must be exactly 10 digits and cannot start with 0)';
      }

      if (!modeSalary) {
        formErrors.modeSalary = '* Mode of Salary is required';
      }

      setErrors(formErrors);

      // Return true if no errors exist
      return Object.keys(formErrors).length === 0;
    } else {


      // Full Name Validation
      if (!fullName) {
        formErrors.fullName = '* Full Name is required';
      }

      // Father's Name Validation
      const companyNameRegex = /^[A-Za-z\s]*$/;
      if (!fathersName.trim()) {
        formErrors.fathersName = '* Father\'s Name is required and cannot contain only spaces.';
      } else if (!companyNameRegex.test(fathersName)) {
        formErrors.fathersName = '* Father\'s Name should only contain letters and spaces.';
      }

      // Mobile Number Validation
      const mobileNumberRegex = /^[1-9][0-9]{9}$/;
      if (!alternateNumber) {
        formErrors.alternateNumber = '* Alternate Mobile is required';
      } else if (!mobileNumberRegex.test(alternateNumber)) {
        formErrors.alternateNumber = '* Invalid mobile number (must be exactly 10 digits and cannot start with 0)';
      }

      // Company Name Validation
      if (!name || name.trim() === '') {
        formErrors.name = '* Company Name is required and cannot be blank.';
      }

      // Designation Validation
      if (!designation) {
        formErrors.designation = '* Designation is required';
      }

      // Salary Validation
      if (!salary) {
        formErrors.salary = '* Salary is required';
      } else if (isNaN(Number(salary)) || Number(salary) < 0) {
        formErrors.salary = '* Salary should be a valid positive number';
      } else if (Number(salary) < 10000) {
        formErrors.salary = '* Salary should be greater than or equal to 10000';
      }

      // Salary Date Validation
      if (!dateOfBirth) {
        formErrors.dateOfBirth = '* Salary Date is required';
      }

      // Mode of Salary Validation
      if (!modeSalary) {
        formErrors.modeSalary = '* Mode of Salary is required';
      }

      // 'Other' Designation Validation
      if (designation === 'Other') {
        if (!other || other.trim() === '') {
          formErrors.other = '* Other designation is required';
        } else if (!/^[A-Za-z0-9 ]+$/.test(other)) {
          formErrors.other = '* Designation can only contain letters, numbers, and spaces, with no special characters, and cannot be empty or just spaces.';
        }
      }

      // IFSC Code Validation
      // if (!ifsc || ifsc.trim() === '') {
      //   formErrors.ifsc = '* IFSC code is required';
      // } else if (!/^[A-Za-z0-9]+$/.test(ifsc)) {
      //   formErrors.ifsc = '* IFSC code should only contain alphanumeric characters';
      // } else if (ifsc.length !== 11) {
      //   formErrors.ifsc = '* IFSC code must be 11 characters long';
      // }

      if (!ifsc || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
        formErrors.ifsc = 'Enter a valid IFSC code (11 characters, e.g., ABCD0123456)';
      }



      // Account Number Validation
      if (!account) {
        formErrors.account = '* Account number is required';
      } else if (account.length < 9 || account.length > 18) {
        formErrors.account = '* Account number should range from 9 to 18 digits';
      } else if (!/^\d+$/.test(account)) {
        formErrors.account = '* Account number should only contain digits';
      }

      // Confirm Account Number Validation
      if (account !== caccount) {
        formErrors.caccount = '* Account numbers do not match';
      }

      // Bank Validation
      if (!bankId || bankId == '0') {
        formErrors.bank = '* Bank selection is required';
      }

      // Set errors to state
      setErrors(formErrors);

      // Return true if no errors exist
      return Object.keys(formErrors).length === 0;
    }
  };


  const handleSubmit = async () => {
    console.log('datata  called', modeSalary)
    const isValid = validateForm();
    console.log('Form is valid:', isValid);

    if (!isValid) {
      console.log('Form validation failed.');
      return;
    }

    if (!selfieUrl) {
      console.log('called')
      Alert.alert('', 'Please upload a selfie before submitting');
      return;
    }

    try {
      setLoading(true);

      const ss = micro ? '1' : '0';
      const micro_status = salary > 25000 ? 1 : ss;
      const des = designation === 'Other' ? other : designation;
      const selectedBank = banks.find((b) => b.value === bankId);

      let requestData = {
        dataset: "all",
        type: "all",
        alterMobile: alternateNumber,
        father_name: fathersName,
        fullname: fullName,
        salary_mode: modeSalary,
      };

      if (modeSalary !== '1') {
        requestData = {
          ...requestData,
          company_name: name,
          risku: companyId,
          designation: des,
          salary: salary,
          salary_date: dateOfBirth,
          micro_status: micro_status,
          ifsc: ifsc,
          account_no: account,
          bankid: bankId,
          bank_name: selectedBank?.label || '',
        };
      }

      console.log('Request Payload:', requestData);

      const response = await HTTPRequest.postPersonal(requestData);

      if (response && response.status === 200) {
        if (response.data.response_status === 1) {
          ToastAndroid.show('Data submitted successfully!', ToastAndroid.SHORT);
          setModalVisibles(false);
        } else {
          setModalVisibles(false);
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

  const handleAmountChange = () => {
    const newAmount = parseInt(inputAmount);
    var last = data.max_amount;
    if (newAmount > 2999 && newAmount <= last) {
      if (!isNaN(newAmount)) {
        setLoanAmount(newAmount);
        setModalVisible(false);
      } else {
        Alert.alert('Please enter a valid amount');
      }
    } else {
      Alert.alert('Warning', 'Input amount should range from 3000 to ' + data.max_amount)
    }
  };


  const handleMobileChange = (text) => {
    // Remove unwanted characters like `.` and `()` from the input
    const sanitizedText = text.replace(/[^\d]/g, ''); // Only keep digits (0-9)
    setAlternateNumber(sanitizedText);
  };

  if (loading) {
    // Show a loading indicator while checking version
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#419FB8" />
      </View>
    );
  }


  if (loadingModal) {
    // Show a loading indicator while checking version
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#419FB8" />
      </View>
    );
  }

  return (
    <View style={styles.container1}>
      <Head title="Product Details" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Loan Amount with Slider */}
        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        <View style={styles.loanAmountSection}>
          <Text style={styles.label}>Loan Amount</Text>
          <View style={styles.loanAmountRow}>
            <View style={styles.amountSection}>
              <Text style={styles.amount}>₹ {loanAmount.toLocaleString('en-IN')}</Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Ionicons name="pencil-sharp" size={25} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <MultiSlider
              values={[loanAmount]}
              min={3000}
              max={parseInt(product.maxAmount) + 0}
              step={1000}
              onValuesChange={values => setLoanAmount(values[0])}
              customMarker={() => <CustomMarker />}
              containerStyle={{ height: 40 }}
              trackStyle={{ height: 10 }}
            />
          </View>
        </View>

        {/* Modal for Input Amount */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <TouchableOpacity style={styles.cancelIcon} onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={25} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalText}>Enter Loan Amount:</Text>
              <TextInput
                style={styles.input}
                value={inputAmount}
                keyboardType="numeric"
                maxLength={7}
                onChangeText={setInputAmount}
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleAmountChange}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal for Documents */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibles}
          onRequestClose={() => setModalVisibles(false)}
        >
          <View style={styles.modalOverlay1}>
            <View style={styles.modalCard1}>
              <TouchableOpacity style={styles.cancelIcon} onPress={() => setModalVisibles(false)}>
                <Ionicons name="close" size={25} color="#000" />
              </TouchableOpacity>

              <Text style={styles.titl}>Please fill the following details</Text>

              <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>


                <View style={styles.uploadContainer}>
                  {selfieUrl ? (
                    <View style={styles.selfieContainer}>
                      <TouchableOpacity onPress={openCamera} style={styles.imageBorderContainer}>
                        <View
                          style={styles.editIcon}
                          onPress={openCamera}
                        >
                          <MaterialIcons name="edit" size={18} color="#fff" />
                        </View>
                        <Image
                          source={{ uri: selfieUrl }}
                          style={styles.profileImage}
                        />
                      </TouchableOpacity>
                      <Text style={styles.uploadText}>Selfie</Text>
                    </View>
                  ) : (
                    <View onPress={openCamera} style={styles.selfieContainer}>
                      <TouchableOpacity onPress={openCamera} style={styles.imageBorderContainer}>
                        <View
                          style={styles.editIcon}
                          onPress={openCamera}
                        >
                          <MaterialIcons name="edit" size={18} color="#fff" />
                        </View>
                        <Image
                          source={require('../assests/profile.png')}
                          style={styles.profileImage}
                        />
                      </TouchableOpacity>
                      <Text style={styles.uploadText}>Upload Selfie</Text>
                    </View>
                  )}

                </View>
                <Text style={styles.label1}>Full Name (As per PAN Card)</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  value={fullName}
                  onChangeText={setFullName}
                  editable={false}  // This will make it non-editable
                  readOnly={true}
                />
                {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}


                <Text style={styles.label1}>Father's Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your father's name"
                  value={fathersName}
                  onChangeText={setFathersName}
                  maxLength={100}
                />
                {errors.fathersName && <Text style={styles.errorText}>{errors.fathersName}</Text>}

                <Text style={styles.label1}>Alternate Mobile Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your alternate mobile number"
                  value={alternateNumber}
                  onChangeText={handleMobileChange}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
                {errors.alternateNumber && <Text style={styles.errorText}>{errors.alternateNumber}</Text>}

                <Text style={styles.label1}>Mode of Salary</Text>
                <View style={styles.card}>
                  <RNPickerSelect
                    onValueChange={(value) => setModeSalary(value)}
                    items={modeSalarys}
                    style={pickerSelectStyles}
                    placeholder={{ label: 'Mode Of Salary', value: null }}
                    value={modeSalary}
                  />
                </View>
                {errors.modeSalary && <Text style={styles.errorText}>{errors.modeSalary}</Text>}

                {modeSalary == '3' || modeSalary == '2' ? (
                  <>
                    <Text style={styles.label1}>Company Name</Text>
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



                    <Text style={styles.label1}>Designation</Text>
                    <View style={styles.card}>
                      <RNPickerSelect
                        onValueChange={(value) => setDesignation(value)}
                        items={designations}
                        style={pickerSelectStyles}
                        placeholder={{ label: 'Select Your Designation', value: null }}
                        value={designation}
                      />
                    </View>
                    {errors.designation && <Text style={styles.errorText}>{errors.designation}</Text>}

                    {designation === 'Other' && (
                      <>
                        <TextInput
                          style={styles.input}
                          placeholder="Enter your Designation"
                          value={other}
                          onChangeText={setOther}
                        />
                        {errors.other && <Text style={styles.errorText}>{errors.other}</Text>}
                      </>
                    )}

                    <Text style={styles.label1}>Salary Amount</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your salary amount"
                      value={salary}
                      onChangeText={setSalary}
                      keyboardType="numeric"

                    />
                    {errors.salary && <Text style={styles.errorText}>{errors.salary}</Text>}

                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                      <Text style={styles.label1}>Salary Date</Text>
                      <TextInput
                        style={[styles.input10, errors.dateOfBirth && styles.inputError]}
                        placeholder="Select your salary date"
                        value={dateOfBirth || ''}
                        editable={false}
                      />
                    </TouchableOpacity>
                    {errors.dateOfBirth && <Text style={styles.errorText}>{errors.dateOfBirth}</Text>}

                    {showDatePicker && (
                      <DateTimePicker
                        value={dateOfBirth ? new Date(dateOfBirth.split('-').reverse().join('-')) : new Date()}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                      />
                    )}

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
                    />
                    {errors.bank && <Text style={styles.errorText}>{errors.bank}</Text>}

                    <Text style={styles.label1}>IFSC Code</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter IFSC Code"
                      value={ifsc}
                      onChangeText={handleIfscChange}
                      autoCapitalize="characters"      // Force uppercase input
                      autoCorrect={false}              // Disable Samsung autocorrect
                      keyboardType="visible-password"  // Helps avoid Samsung's auto-lowercase issue
                      maxLength={11}
                    />
                    {errors.ifsc && <Text style={styles.errorText}>{errors.ifsc}</Text>}

                    <Text style={styles.label1}>Account No. (where your Salary is credited)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Account No."
                      value={account}
                      onChangeText={setAccount}
                      maxLength={18}
                      keyboardType="numeric"
                      secureTextEntry={true}
                    />
                    {errors.account && <Text style={styles.errorText}>{errors.account}</Text>}

                    <Text style={styles.label1}>Re-Enter Account No.</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Re-Enter Account No."
                      value={caccount}
                      onChangeText={setCaccount}
                      maxLength={18}
                      keyboardType="numeric"


                    />
                    {errors.caccount && <Text style={styles.errorText}>{errors.caccount}</Text>}

                    {Number(salary) < 24999 && (
                      <View style={styles.design}>
                        <CheckBox value={micro} onValueChange={setMicro} style={styles.checkbox} />
                        <Text style={styles.checkboxLabel}>
                          I confirm my family (me, spouse, and unmarried children) annual income is more than Rs 300000/-.
                        </Text>
                      </View>
                    )}
                  </>
                ) : null}
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </ScrollView>

            </View>
          </View>
        </Modal>

        {/* Details Section */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total APR</Text>
            <Text style={styles.detailValue}>{data.Total_APR}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Interest</Text>
            <Text style={styles.detailValue}>₹ {data.interest_amt}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Repayment Amount</Text>
            <Text style={styles.detailValue}>₹ {data.Total_Pay_Amount}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Loan Amount</Text>
            <Text style={styles.detailValue}>₹ {loanAmount}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tenure</Text>
            <Text style={styles.detailValue}>{data.loan_tenure} Days</Text>
          </View>
          <View style={styles.separatorLine} />
          <Text style={styles.text}>
            <Text style={styles.redAsterisk}>*</Text> Indicative based on IRR method and may vary as per actual tenure of Loan. The actual rate would be Indicated in the Loan Agreement.
          </Text>
        </View>

        {/* EMI Table */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>S.No.</Text>
            <Text style={styles.tableHeaderCell}>Interest</Text>
            <Text style={styles.tableHeaderCell}>EMI Amount</Text>
          </View>
          <FlatList
            data={emidata}
            renderItem={renderEMIRow}
            keyExtractor={(item) => item.id}
          />
        </View>
        {buttonStatus == '3' || buttonStatus == '4' || buttonStatus == '5' || buttonStatus == '' ?
          <TouchableOpacity style={styles.proceedButton} onPress={handleModal}>
            <Text style={styles.proceedButtonText}>Next</Text>
          </TouchableOpacity>
          : null
        }
      </ScrollView>
      {isCameraVisible && (
        <Modal visible={isCameraVisible} transparent={false}>
          <RNCamera
            ref={(ref) => setCamera(ref)}
            style={styles.camera}
            type={RNCamera.Constants.Type.front}
            captureAudio={false}
            mirrorImage={false}  // Disable the mirror effect
            onCameraReady={() => console.log('Camera is ready')}
            onMountError={(error) => console.error('Camera mount error:', error)}
          >
            <View style={styles.buttonContainer}>

              <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
                <Image
                  source={require('../assests/cameras.png')} // Path to your custom camera icon
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={closeCamera} style={styles.closeButton}>
              <Ionicons name="close" size={30} color="#000" />
            </TouchableOpacity>
          </RNCamera>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  uploadContainer: { alignItems: 'center', marginBottom: 20 },

  uploadText: { fontSize: 16, marginBottom: 15 },
  selfieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: 10,
  },
  searchTextInput: {
    borderColor: '#ccc', // Change the border color of the search input box
    borderWidth: 1, // Make sure the border is visible
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    // marginLeft: 10,
    marginTop: 0, // Align closer to the input box
    // marginBottom: 10,
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

  editIcon: {
    position: 'absolute',
    top: 50,
    left: 56,
    zIndex: 10, // Makes sure it's on top
    backgroundColor: '#419fb8',
    borderRadius: 30,
    padding: 3,
    borderWidth: 2,
    borderColor: '#fff',
  },

  scrollContainer1: {
    maxHeight: 300,
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
  design: {
    flexDirection: 'row', // This ensures the checkbox and text are aligned horizontally
    alignItems: 'center',  // Vertically align the checkbox and text
    flexWrap: 'wrap',      // Allows text to wrap in case it overflows
    // marginVertical: 10,    // Adds some spacing for better readability
  },
  imageBorderContainer: {
    borderWidth: 2, // Border around the image container
    borderColor: '#419fb8', // Border color
    borderRadius: 50, // Rounded corners to match the circular image
    padding: 2, // Padding inside the border
    marginBottom: 10
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40, // Make the image circular
  },
  dropdown: {
    // height: 45,
    // borderRadius: 8,
    marginBottom: 15,
    borderColor: '#dfdfdf'
  },
  checkbox: {
    marginRight: 10, // Adds space between the checkbox and the text
  },
  checkboxLabel: {
    flex: 1,          // Ensures the text can take up the remaining space
    flexWrap: 'wrap', // Allows text to wrap if it overflows
    fontSize: 14,     // Adjust text size as necessary
  },
  dropdownStyle: {
    borderRadius: 8,
    zIndex: 1000,
    borderColor: '#ccc',
    // marginTop:20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    // padding: 10,
    marginTop: 3,
    borderWidth: 1,
    borderColor: "#dfdfdf",
    marginBottom: 15,
    color: '#419fb8'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  container: {
    flexGrow: 1, // Allow scrolling if content exceeds view height
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  customMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    marginTop: 8
  },
  chatIcon: {
    width: 35,
    height: 35,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Optional: Semi-transparent background
  },
  text: {
    fontSize: 12, // Small font size for the entire text
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    borderColor: '#fff',
    borderWidth: 1,
    height: 100,
    width: '100%',
    backgroundColor: '#fff'
  },
  redAsterisk: {
    color: 'red', // Red color for the asterisk
    fontSize: 12, // Same small size to match the text
  },
  customMarkerImage: {
    width: 30,
    height: 30,
  },

  loanAmountSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  header1: {
    padding: 5,
    borderRadius: 10,
    backgroundColor: 'transparent', // Transparent background
    borderWidth: 2, // Border thickness
    borderColor: '#419fb8', // Border color
    paddingHorizontal: 12,
    borderRadius: 10, // Rounded corners
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
    marginBottom: 10,
  },
  tit: {
    fontSize: 16,
    justifyContent: 'center',
    fontWeight: 'bold',
    color: '#419FB8',
    alignItems: 'center',

  },

  titl: {
    fontSize: 16,
    marginBottom: 15,
    marginTop: 10,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',

  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  loanAmountRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
  },
  label1: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
    marginTop: 15,
  },
  label: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  amountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 10,
    textAlign: 'center',
  },
  detailsSection: {
    marginBottom: 20,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#000',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000'
  },
  tableContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
    marginBottom: 10,
  },
  tableHeaderCell: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000'
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  tableCell: {
    fontSize: 14,
    color: '#000'
  },
  proceedButton: {
    backgroundColor: '#419fb8',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  proceedButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlay1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalCard1: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    height: '95%',
    width: '95%',
    // alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  cancelIcon: {
    alignSelf: 'flex-end',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderColor: '#dfdfdf',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    padding: 10,
    // marginTop: 10,
  },
  input10: {
    borderColor: '#dfdfdf',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    padding: 10,
    marginBottom: 15,
    color: '#111',
  },
  submitButton: {
    backgroundColor: '#419fb8',
    paddingVertical: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  separatorLine: {
    height: 1,
    backgroundColor: "#dfdfdf",
    marginVertical: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 5, // Place it 20px from the top
    right: 5, // Place it 20px from the right
    backgroundColor: 'transparent',
    padding: 10,
  },
  icon: {
    height: 60,
    width: 60
  },
  captureButton: {
    position: 'absolute',
    left: '40%',
    backgroundColor: 'transparent',
    bottom: 20,
    padding: 10,
  },
  input1: { borderWidth: 1, borderColor: '#ccc', padding: 12, paddingVertical: 10, marginTop: 10, borderRadius: 5, marginBottom: 15, },

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

export default LoanDetailsScreen;
