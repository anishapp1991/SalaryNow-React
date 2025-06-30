import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity, Platform,
  Image, ScrollView, Alert, Modal, PermissionsAndroid, Linking, ActivityIndicator, ToastAndroid,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { RNCamera } from 'react-native-camera';
import { RNS3 } from 'react-native-aws3';
import Head from './Header';
import Geolocation from 'react-native-geolocation-service';
import HTTPRequest from '../utils/HTTPRequest';
import ImagePicker from 'react-native-image-crop-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';


const Personal = ({ navigation, route }) => {
  const { status } = route.params;
  const [panCard, setPanCard] = useState('');
  const [fullName, setFullName] = useState('');
  const [fathersName, setFathersName] = useState('');
  const [alternateNumber, setAlternateNumber] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('');
  // const dispatch = useDispatch();
  const [maritalType, setMaritalType] = useState('');
  const [genders, setGenders] = useState([]);
  const [maritalTypes, setMaritalTypes] = useState([]);
  const [selfieUrl, setSelfieUrl] = useState('');
  const [keyId, setKeyId] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [path, setPath] = useState('');
  const [region, setRegion] = useState('');
  const [bucket, setBucket] = useState('');
  const [isCameraVisible, setCameraVisible] = useState(false);
  const [camera, setCamera] = useState(null);
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  const [loading, setLoading] = useState(true);
  const [androidVersion, setAndroidVersion] = useState();

  const [errors, setErrors] = useState({
    panCard: '',
    fullName: '',
    fathersName: '',
    alternateNumber: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    maritalType: '',
  });


  const validateFathersName = (fathersName) => {
    const companyNameRegex = /^[A-Za-z\s]*$/; // Only allows letters and spaces
    const formErrors = {};

    if (!fathersName) {
      formErrors.fathersName = 'Father\'s Name is required';
    } else if (!companyNameRegex.test(fathersName)) {
      formErrors.fathersName = 'Father\'s Name should only contain letters and spaces';
    } else {
      // Clear error if the input is valid
      formErrors.fathersName = '';
    }

    return formErrors;
  };

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
    const getAndroidVersion = () => {
      if (Platform.OS === 'android') {
        const androidVersion = Platform.Version;
        console.log('Android Version:', typeof androidVersion);
        setAndroidVersion(androidVersion);
      } else {
        console.log('Not an Android device');
        return null;
      }
    };
    if (status === 'View') {
      fetchSelfie();
    }
    const fetchStoredData = async () => {
      try {
        const storedCommon = await EncryptedStorage.getItem('commonList');
        const commonData = JSON.parse(storedCommon);
        console.log(commonData.commonList.gender);

        const genderOptions = commonData.commonList.gender.map((type) => ({
          label: type.name,
          value: type.name,
        }));
        setGenders(genderOptions);

        const maritalOptions = commonData.commonList.marital.map((type) => ({
          label: type.name,
          value: type.name,
        }));
        setMaritalTypes(maritalOptions)

      } catch (error) {
        console.error('Failed to fetch stored data', error);
      }
    }
    fetchStoredData();
    checkLocationPermission();
    fetchSelfie();
    getAndroidVersion();
  }, [status]);

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




  const validateForm = () => {
    let formErrors = {};

    // Check if required fields are filled


    if (!fullName) {
      formErrors.fullName = 'Full Name is required';
    }

    const companyNameRegex = /^[A-Za-z\s]*$/;

    if (!fathersName.trim()) {
      formErrors.fathersName = 'Father\'s Name is required and cannot contain only spaces.';
    } else if (!companyNameRegex.test(fathersName)) {
      formErrors.fathersName = 'Father\'s Name should only contain letters and spaces.';
    }

    const mobileNumberRegex = /^[1-9][0-9]{9}$/;
    if (!alternateNumber) {
      formErrors.alternateNumber = 'Alternate Mobile is required';
    } else if (!mobileNumberRegex.test(alternateNumber)) {
      formErrors.alternateNumber = 'Invalid mobile number (must be exactly 10 digits and cannot start with 0)';
    }

    // Set the errors
    setErrors(formErrors);

    // Return true if no errors
    return Object.keys(formErrors).length === 0;
  };




  const fetchPersonalDetails = async (formData = { dataset: "single", type: 'personal' }) => {

    setLoading(true)
    try {
      const response = await HTTPRequest.getPersonal(formData);
      if (response.status === 200) {
        const details = response.data.response_data.personal;
        console.log(details);
        // setPanCard(details.pan_no);
        setFullName(details.fullname);
        setFathersName(details.father_name);
        setAlternateNumber(details.alterMobile);
        // setEmail(details.email);
        // setDateOfBirth(details.dob);
        // setGender(details.gender);
        // setMaritalType(details.marital_status);
        s3Credential();
      } else {
        // Alert.alert('Error', 'Failed to fetch personal details.');
      }
    } catch (error) {
      console.error('Error fetching personal details:', error);
      // Alert.alert('Error', 'An error occurred while fetching personal details.');
    } finally {
      setLoading(false);
    }
  };


  const s3Credential = async () => {
    try {
      const response = await HTTPRequest.getCredential({ page: "selfie" });
      if (response.status === 200) {

        var power = response.data.data;
        // console.log(power, 'response')
        setKeyId(power.IAM_KEY);
        setAccessKey(power.IAM_SECRET);
        setBucket(power.bucket);
        setPath(power.path);
        setRegion(power.region);

      } else {
        // Alert.alert('Error', 'Failed to fetch Credential');
      }
    } catch (error) {
      console.error('Error fetching personal details:', error);
      // Alert.alert('Error', 'An error occurred while fetching Credential');
    }

  }



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
      // Alert.alert('Error', 'An error occurred while requesting location permission.');
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


  const openCamera = () => setCameraVisible(true);
  const closeCamera = () => setCameraVisible(false);

  const takePicture = async () => {
    if (camera) {
      const options = { quality: 0.8 };
      const data = await camera.takePictureAsync(options);
      // console.log(androidVersion, typeof androidVersion)
      // console.log('Captured image data:', data);
      cropImage(data);
      // uploadToS3(data);
      // closeCamera();
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
    console.log('Uploading image:', image.path);
    // Check for the correct file URI and name
    const file = {
      uri: image.path,  // The file URI from camera capture
      name: 'selfie_' + image.path.split('/').pop(), // File name
      type: 'image/jpeg',  // Correct mime type for JPG
    };

    // Options for S3 upload
    const options = {
      keyPrefix: `${path}`,  // Path within your bucket
      bucket: bucket,  // S3 bucket name
      region: region,  // AWS region
      accessKey: keyId,  // AWS access key
      secretKey: accessKey,  // AWS secret key
      successActionStatus: 201,  // HTTP status code on success
      ACL: 'public-read',  // Public access for the uploaded image
    };

    try {
      // Attempt to upload the image
      const response = await RNS3.put(file, options);

      console.log('S3 Upload Response:', response);

      if (response.status === 201) {
        // Successfully uploaded the image
        console.log('Image uploaded successfully:', response.body);
        // Call reverseGeocode with the uploaded file name or S3 URL
        reverseGeocode(response.body.postResponse.key); // Assuming you want to pass the S3 file path
      } else {
        // Handle upload failure
        console.error('Failed to upload image to S3:', response);
        // Alert.alert('Upload Error', 'Could not upload the image to AWS S3.');
      }
    } catch (error) {
      // Catch any errors during the upload process
      console.error('Error uploading image:', error);
      // Alert.alert('Upload Error', 'Could not upload the image to AWS S3.');
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

  const onDateChange = (event, selectedDate) => {
    if (event.type === 'set' && selectedDate) {
      // Get the individual components of the date
      const month = selectedDate.getMonth() + 1; // Months are zero-indexed
      const day = selectedDate.getDate();
      const year = selectedDate.getFullYear();

      // Format the date as mm-dd-yyyy
      const formattedDate = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;

      // Set the formatted date in the state
      setDateOfBirth(formattedDate);
    } else {
      // If the user pressed 'Cancel', clear the date input
      setDateOfBirth('');
    }

    // Close the date picker
    setShowDatePicker(false);
  };
  const handleContinue = async () => {
    if (validateForm()) {
      if (selfieUrl == '') {
        Alert.alert('', 'Please Upload Selfie Before Submmiting');
      } else {
        const requestData = {
          dataset: "single",
           type: 'personal',
          alterMobile: alternateNumber,
          father_name: fathersName,
          fullname: fullName,
        };
        console.log(requestData, 'requestData')
        try {
          setLoading(true);
          const Response = await HTTPRequest.postPersonal(requestData);

          if (Response.status === 200) {
            console.log(typeof Response.data.response_status)
            if (Response.data.response_status == 1) {
              console.log('Response:', Response.data);
              ToastAndroid.show('Data submitted successfully!', ToastAndroid.SHORT);

              // Alert.alert('Confirm', 'Data saved successfully');
              navigation.goBack();
            }
            else {
              Alert.alert('', Response.data.response_msg);
            }
          }
        } catch (error) {
          console.error('data fail', error);
          // Alert.alert('Error', `An error occurred: ${error.message}`);
        }finally{
          setLoading(false);
        }
      }
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

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);

  return (
    <View style={styles.container1}>
      <Head title="Personal Information" />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
          {status == 'Edit' ?
            <Text style={styles.subtitle}>Please fill in the following details</Text>
            :
            <Text style={styles.subtitle}>Please Check the following details</Text>}


          <View style={styles.uploadContainer}>
            {selfieUrl ? (
              <View style={styles.selfieContainer}>
                <View style={styles.imageBorderContainer}>
                  <Image
                    source={{ uri: selfieUrl }}
                    style={styles.profileImage}
                  />
                </View>
                <Text style={styles.uploadText}>Selfie</Text>
              </View>
            ) : (
              <TouchableOpacity onPress={openCamera} style={styles.selfieContainer}>
                <View style={styles.imageBorderContainer}>
                  <Image
                    source={require('../assests/profile.png')}
                    style={styles.profileImage}
                  />
                </View>
                <Text style={styles.uploadText}>Upload Selfie</Text>
              </TouchableOpacity>
            )}

          </View>

          <View style={styles.form}>
            {/* <TextInput
              style={styles.input}
              placeholder="PAN Card No."
              value={panCard}
              onChangeText={setPanCard}
              editable={false}  // This will make it non-editable
              readOnly={true}

            />
            {errors.panCard && <Text style={styles.errorText}>{errors.panCard}</Text>} */}
            <TextInput
              style={styles.input}
              placeholder="Full Name (As per PAN Card)"
              value={fullName}
              onChangeText={setFullName}
              editable={false}  // This will make it non-editable
              readOnly={true}
            />
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
            <TextInput
              style={styles.input}
              placeholder="Father's Name"
              value={fathersName}
              onChangeText={setFathersName} // Use the validation function
              maxLength={50}
              editable={status === 'Edit'}
            />
            {errors.fathersName && <Text style={styles.errorText}>{errors.fathersName}</Text>}
            <TextInput
              style={styles.input}
              placeholder="Alternate Mobile No."
              value={alternateNumber}
              onChangeText={handleMobileChange}  // Handle text change and sanitize
              keyboardType="phone-pad"
              maxLength={10}
              editable={status === 'Edit'}
            />
            {errors.alternateNumber && <Text style={styles.errorText}>{errors.alternateNumber}</Text>}
            {/* <TextInput
              style={styles.input}
              placeholder="Email ID"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={false}  // This will make it non-editable
              readOnly={true}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <TouchableOpacity>
              <FloatingPlaceholderInput
                style={[errors.dateOfBirth && styles.inputError]}
                placeholder="Date of Birth"
                value={dateOfBirth}
                editable={false}  // Makes it non-editable
              />
            </TouchableOpacity>
            {errors.dateOfBirth && <Text style={styles.errorText}>{errors.dateOfBirth}</Text>}
            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth ? new Date(dateOfBirth) : new Date()}
                mode="date"
                display="default"
                maximumDate={maxDate}
                onChange={onDateChange}
              />
            )}

            <View style={styles.card}>
              <RNPickerSelect
                onValueChange={(value) => {
                  setGender(value);  // Trigger validation after selecting a value
                }}
                items={genders}
                style={pickerSelectStyles}
                placeholder={{ label: 'Gender', value: null }}
                value={gender}
                disabled={status !== 'Edit'} // Disable selection based on status
              />
            </View>
            {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
            <View style={styles.card}>
              <RNPickerSelect
                onValueChange={(value) => {
                  setMaritalType(value);
                }}
                items={maritalTypes}
                style={pickerSelectStyles}
                placeholder={{ label: 'Select Marital Status', value: null }}
                value={maritalType}
                placeholderTextColor="#000"
                disabled={status !== 'Edit'} // Disable selection based on status
              />
            </View>
            {errors.maritalType && <Text style={styles.errorText}>{errors.maritalType}</Text>} */}

          </View>


        </ScrollView>
        <View style={styles.footer}>
          {status == 'Edit' ?
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
            : null}
        </View>
      </View>
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
  container1: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 20 },
  scrollViewContent: { alignItems: 'center' },
  subtitle: { fontSize: 14, marginVertical: 10 },
  uploadContainer: { alignItems: 'center', marginBottom: 20 },
  // profileImage: { width: 80, height: 80, borderRadius: 50, marginBottom: 10 },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40, // Make the image circular
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    // padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#419fb8",
  },
  errorInput: {
    borderColor: 'red',
  },
  icon: {
    height: 60,
    width: 60
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 10,
    marginTop: 0, // Align closer to the input box
    marginBottom: 10,
  },
  imageBorderContainer: {
    borderWidth: 2, // Border around the image container
    borderColor: '#419fb8', // Border color
    borderRadius: 50, // Rounded corners to match the circular image
    padding: 2, // Padding inside the border
    marginBottom: 10
  },
  uploadText: { fontSize: 16 },
  form: { width: '100%' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, paddingVertical: 10, marginTop: 10, borderRadius: 5, marginBottom: 15, },
  continueButton: { backgroundColor: '#419fb8', alignItems: 'center', borderRadius: 25, paddingVertical: 12 },
  continueText: { color: '#fff', fontSize: 14 },
  camera: { flex: 1 },
  selfieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: 10,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 5, // Place it 20px from the top
    right: 5, // Place it 20px from the right
    backgroundColor: 'transparent',
    padding: 10,
  },

  captureButton: {
    position: 'absolute',
    left: '38%',
    backgroundColor: 'transparent',
    bottom: 15,
    padding: 10,
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
  // inputAndroid: {
  //   fontSize: 16,
  //   paddingVertical: 8,
  //   paddingHorizontal: 10,
  //   borderWidth: 1,
  //   borderColor: '#ccc',
  //   borderRadius: 4,
  //   color: 'black',
  //   marginBottom: 15,
  // },
};

export default Personal;
