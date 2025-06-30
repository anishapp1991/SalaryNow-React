import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Linking, ToastAndroid } from 'react-native';
import Head from './Header';
import ImagePicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image';
import HTTPRequest from '../utils/HTTPRequest';
import DropDownPicker from 'react-native-dropdown-picker'; // Using DropDownPicker
import { RNS3 } from 'react-native-aws3';
import RNFS from 'react-native-fs';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';


const PreviousLoans = ({ navigation, route }) => {
  const { status } = route.params;

  // State for each image picker
  const [previewImage1, setPreviewImage1] = useState(null);
  const [isLoading1, setIsLoading1] = useState(false);
  const [previewImage2, setPreviewImage2] = useState(null);
  const [isLoading2, setIsLoading2] = useState(false);
    const [loading, setLoading] = useState(false);
  const [pre1, setPre1] = useState(null);
  const [pre2, setPre2] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [keyId, setKeyId] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [path, setPath] = useState('');
  const [region, setRegion] = useState('');
  const [bucket, setBucket] = useState('');

  useEffect(() => {
    if (status === 'View') {
      console.log('aaa');
      fetchRes();
    }
    const s3Credential = async () => {
      try {
        const response = await HTTPRequest.getCredential({ page: "address_proof" });
        if (response.status === 200) {
          const power = response.data.data;
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
    };
    const fetchResidential = async () => {
      try {
        const response = await HTTPRequest.Resident();
        if (response.status === 200) {
          console.log(response.data.response_data, 'responsedata')
          var dd = response.data.response_data;
          const genderOptions = dd.map((type) => ({
            label: type.name,
            value: type.residence_proof_id,
          }));
          setSelectedOptions(genderOptions);
        }

      } catch (error) {
        console.error('Failed to fetch stored data', error);
      }
    }
    s3Credential();
    fetchResidential();
  }, [status]);

  const fetchRes = async () => {
    try {
      const response = await HTTPRequest.selfie({ doctype: "address_proof" });
      if (response.status === 200) {
        console.log(response.data.data)
        const details = response.data.data;
        if (details) {
          console.log(details, 'vjhhhj')
          setPre1(details.front);
          setPre2(details.back);
          setSelectedOption(details.doc_type)
        }
      } else {
        // Alert.alert('Error', 'Failed to fetch selfie.');
      }
    } catch (error) {
      console.error('Error fetching selfie:', error);
      // Alert.alert('Error', 'An error occurred while fetching selfie.');
    }
  };


  // Function for first image picker
  const openImagePicker1 = async () => {
    const result = await check(PERMISSIONS.ANDROID.CAMERA); // Check the camera permission
    console.log('Permission check result for image picker 1: ', result);

    if (result === RESULTS.GRANTED) {
      // Permission is granted, open the camera
      setIsLoading1(true); // Start loading indicator

      ImagePicker.openCamera({
        cropping: true,
        // width: 820,
        // height: 1100,
        compressImageQuality: 0.5,
      })
        .then(async (image) => {
          try {
            // Convert the image to Base64
            setPre1(image.path);
            const base64String = await RNFS.readFile(image.path, 'base64');

            // Add the Base64 image header for UTF-8 compatibility
            const utf8Base64String = `${base64String}`;

            // Set the Base64 string as the preview
            setPreviewImage1(utf8Base64String); // Corrected the setter to use `setPreviewImage1`

            setIsLoading1(false); // Stop loading indicator
          } catch (error) {
            console.error('Error converting image to Base64:', error);
            Alert.alert('Error', 'Failed to process the selected image.');
            setIsLoading1(false); // Stop loading in case of error
          }
        })
        .catch((error) => {
          console.error('Error picking image:', error);
          Alert.alert('Warning', 'You pressed back while picking the image.');
          setIsLoading1(false); // Ensure loading stops on error
        });
    } else if (result === RESULTS.DENIED) {
      // Request permission if it was denied
      const requestResult = await request(PERMISSIONS.ANDROID.CAMERA);
      if (requestResult === RESULTS.GRANTED) {
        // Permission granted, open the camera
        openImagePicker1(); // Call the function recursively
      } else {
        console.log('Permission denied again!');
        Alert.alert(
          'Permission Denied',
          'You need to grant camera permission to use this feature.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      }
    } else if (result === RESULTS.BLOCKED) {
      // Permission is blocked, show alert to go to settings
      console.log('Permission is blocked!');
      Alert.alert(
        'Camera Permission Blocked',
        'Camera access is blocked. Please enable it in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
    }
  };

  // Function for the second image picker
  const openImagePicker2 = async () => {
    const result = await check(PERMISSIONS.ANDROID.CAMERA); // Check the camera permission
    console.log('Permission check result for image picker 2: ', result);

    if (result === RESULTS.GRANTED) {
      // Permission is granted, open the camera
      setIsLoading2(true); // Start loading indicator

      ImagePicker.openCamera({
        cropping: true,
        width: 800,
        height: 900,
        compressImageQuality: 0.5,
      })
        .then(async (image) => {
          try {
            setPre2(image.path);
            // Convert the image to Base64
            const base64String = await RNFS.readFile(image.path, 'base64');

            // Add the Base64 image header for compatibility
            const utf8Base64String = `${base64String}`;

            // Set the Base64 string as the preview
            setPreviewImage2(utf8Base64String);

            setIsLoading2(false); // Stop loading indicator
          } catch (error) {
            console.error('Error converting image to Base64:', error);
            Alert.alert('Error', 'Failed to process the selected image.');
            setIsLoading2(false); // Stop loading in case of error
          }
        })
        .catch((error) => {
          console.error('Error picking image:', error);
          Alert.alert('Warning', 'You pressed back while picking the image.');
          setIsLoading2(false); // Ensure loading stops on error
        });
    } else if (result === RESULTS.DENIED) {
      // Request permission if it was denied
      const requestResult = await request(PERMISSIONS.ANDROID.CAMERA);
      if (requestResult === RESULTS.GRANTED) {
        // Permission granted, open the camera
        openImagePicker2(); // Call the function recursively
      } else {
        console.log('Permission denied again!');
        Alert.alert(
          'Permission Denied',
          'You need to grant camera permission to use this feature.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      }
    } else if (result === RESULTS.BLOCKED) {
      // Permission is blocked, show alert to go to settings
      console.log('Permission is blocked!');
      Alert.alert(
        'Camera Permission Blocked',
        'Camera access is blocked. Please enable it in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
    }
  };

  // Submit function to handle form submission
  const Submit = async () => {
    // Determine if the selected option requires both images
    // console.log(selectedOption);
    setLoading(true);
    const requiresBothImages = ['1', '3', '4'].includes(selectedOption);

    // Check image requirements based on the selected option
    if (requiresBothImages && (!previewImage1 || !previewImage2)) {
      Alert.alert(
        'Error',
        'Please upload both the front and back images before submitting.'
      );
      return;
    }

    if (!requiresBothImages && !previewImage1) {
      Alert.alert('Error', 'Please upload the front image before submitting.');
      return;
    }
    var payload = {
      file1: previewImage1,
      file2: previewImage2,
      type: 'address_proof',
      document_type: selectedOption,
    }

    try {
      const response = await HTTPRequest.updatePancard(payload);
      console.log(response, 'jkjuhui')
      if (response.status === 200 && response.data.response_status === 1) {
        ToastAndroid.show('Data submitted successfully!', ToastAndroid.SHORT);       
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', response.data.response_msg);
      }
    } catch (error) {
      console.error('Error updating Pancard information:', error);
      Alert.alert('Network Problem', 'Please Submit Again');
    }finally{
      setLoading(false);
    }
  };


  useEffect(() => {
    if (selectedOption && previewImage1 && previewImage2) {
      renderImageContainers();
    }
  }, [selectedOption, previewImage1, previewImage2]);

  // Conditional rendering based on selected option
  const renderImageContainers = () => {
    console.log(selectedOption, 'select')
    // console.log(previewImage1,previewImage2)
    switch (selectedOption) {
      case '1':
        return (
          <>
            <Text style={styles.headerText1}>Front Side</Text>
            <TouchableOpacity style={styles.dottedBox} onPress={status === 'Edit' ? openImagePicker1 : null} disabled={status === 'View'} >
              {isLoading1 ? (
                <ActivityIndicator size="large" color="#0288D1" />
              ) : pre1 ? (
                <FastImage
                  style={styles.previewImage}
                  source={{ uri: pre1 }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : (
                <>
                  <FastImage
                    style={styles.chatIcon}
                    source={require('../assests/camera.png')}
                  />
                  <Text style={styles.noLoanText}>Take Picture</Text>
                </>
              )}
            </TouchableOpacity>
            <Text style={styles.headerText1}>Back Side</Text>
            <TouchableOpacity style={styles.dottedBox} onPress={status === 'Edit' ? openImagePicker2 : null} disabled={status === 'View'} >
              {isLoading2 ? (
                <ActivityIndicator size="large" color="#0288D1" />
              ) : pre2 ? (
                <FastImage
                  style={styles.previewImage}
                  source={{ uri: pre2 }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : (
                <>
                  <FastImage
                    style={styles.chatIcon}
                    source={require('../assests/camera.png')}
                  />
                  <Text style={styles.noLoanText}>Take Picture</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        );
      case '3':
        return (
          <>
            <Text style={styles.headerText1}>Front Side</Text>
            <TouchableOpacity style={styles.dottedBox} onPress={status === 'Edit' ? openImagePicker1 : null} disabled={status === 'View'} >
              {isLoading1 ? (
                <ActivityIndicator size="large" color="#0288D1" />
              ) : pre1 ? (
                <FastImage
                  style={styles.previewImage}
                  source={{ uri: pre1 }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : (
                <>
                  <FastImage
                    style={styles.chatIcon}
                    source={require('../assests/camera.png')}
                  />
                  <Text style={styles.noLoanText}>Take Picture</Text>
                </>
              )}
            </TouchableOpacity>
            <Text style={styles.headerText1}>Back Side</Text>
            <TouchableOpacity style={styles.dottedBox} onPress={status === 'Edit' ? openImagePicker2 : null} disabled={status === 'View'} >
              {isLoading2 ? (
                <ActivityIndicator size="large" color="#0288D1" />
              ) : pre2 ? (
                <FastImage
                  style={styles.previewImage}
                  source={{ uri: pre2 }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : (
                <>
                  <FastImage
                    style={styles.chatIcon}
                    source={require('../assests/camera.png')}
                  />
                  <Text style={styles.noLoanText}>Take Picture</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        );
      case '4':
        return (
          <>
            <Text style={styles.headerText1}>Front Side</Text>
            <TouchableOpacity style={styles.dottedBox} onPress={status === 'Edit' ? openImagePicker1 : null} disabled={status === 'View'} >
              {isLoading1 ? (
                <ActivityIndicator size="large" color="#0288D1" />
              ) : pre1 ? (
                <FastImage
                  style={styles.previewImage}
                  source={{ uri: pre1 }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : (
                <>
                  <FastImage
                    style={styles.chatIcon}
                    source={require('../assests/camera.png')}
                  />
                  <Text style={styles.noLoanText}>Take Picture</Text>
                </>
              )}
            </TouchableOpacity>
            <Text style={styles.headerText1}>Back Side</Text>
            <TouchableOpacity style={styles.dottedBox} onPress={status === 'Edit' ? openImagePicker2 : null} disabled={status === 'View'} >
              {isLoading2 ? (
                <ActivityIndicator size="large" color="#0288D1" />
              ) : pre2 ? (
                <FastImage
                  style={styles.previewImage}
                  source={{ uri: pre2 }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : (
                <>
                  <FastImage
                    style={styles.chatIcon}
                    source={require('../assests/camera.png')}
                  />
                  <Text style={styles.noLoanText}>Take Picture</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        );
      case '5':
        return (
          <>
            <Text style={styles.headerText1}>Front Side</Text>
            <TouchableOpacity style={styles.dottedBox} onPress={status === 'Edit' ? openImagePicker1 : null} disabled={status === 'View'} >
              {isLoading1 ? (
                <ActivityIndicator size="large" color="#0288D1" />
              ) : pre1 ? (
                <FastImage
                  style={styles.previewImage}
                  source={{ uri: pre1 }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : (
                <>
                  <FastImage
                    style={styles.chatIcon}
                    source={require('../assests/camera.png')}
                  />
                  <Text style={styles.noLoanText}>Take Picture</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        );
      case '6':
        return (
          <>
            <Text style={styles.headerText1}>Front Side</Text>
            <TouchableOpacity style={styles.dottedBox} onPress={status === 'Edit' ? openImagePicker1 : null} disabled={status === 'View'} >
              {isLoading1 ? (
                <ActivityIndicator size="large" color="#0288D1" />
              ) : pre1 ? (
                <FastImage
                  style={styles.previewImage}
                  source={{ uri: pre1 }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : (
                <>
                  <FastImage
                    style={styles.chatIcon}
                    source={require('../assests/camera.png')}
                  />
                  <Text style={styles.noLoanText}>Take Picture</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        );
      default:
        return null;
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
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Head title="Address Proof" />
        <View style={styles.noLoanContainer}>
          <Text style={styles.headerText}>
            {status === 'Edit' ? 'Please Provide the following Information' : 'Please Check the following Information'}
          </Text>
          <Text style={styles.headerText1}>Select Option</Text>

          {/* Dropdown menu for selecting options */}
          <DropDownPicker
            open={open}
            value={selectedOption}
            items={selectedOptions}
            setOpen={setOpen}
            setValue={(value) => {
              setSelectedOption(value);
              setPreviewImage1(null);
              setPreviewImage2(null);
              setPre1(null);
              setPre2(null);
            }}
            setItems={setSelectedOption}
            placeholder="Select Document"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownStyle}
            disabled={status === "View"} // Disable dropdown in view mode
          />

          {/* Conditionally render image pickers and submit button */}
          {selectedOption && (
            <>
              {renderImageContainers()}

              {status === 'Edit' && (
                <TouchableOpacity style={styles.bottomButton} onPress={Submit}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

// Picker styles with space on both sides and hard border
const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 10,
    borderColor: '#000',
    borderRadius: 4,
    color: '#000',
    marginBottom: 15,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    color: '#00f',
    marginBottom: 15,
  },
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  chatIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  dottedBox: {
    width: 300,
    height: 250,
    borderWidth: 2,
    borderColor: '#0288D1',
    borderStyle: 'dotted',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    // marginTop: 5,
  },
  noLoanContainer: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  // footer: {
  //   paddingHorizontal: 20,
  //   paddingVertical: 10,
  // },
  headerText: {
    fontWeight: 'bold',
    fontSize: 15,
    fontStyle: 'italic',
    marginTop: 25,
    color: '#000',
  },
  headerText1: {
    fontWeight: 'bold',
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 25,
    color: '#777',
    marginBottom: 10,
  },
  noLoanText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    fontWeight: 'bold',
    marginTop: 10,
  },
  bottomButton: {
    width: '80%',
    padding: 15,
    backgroundColor: '#419fb8',
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // ScrollView content styling
  scrollViewContainer: {
    flexGrow: 1, // Ensures content takes up full space in the scrollview
    justifyContent: 'center', // Centers content vertically
    paddingBottom: 20, // Ensures padding at the bottom of the screen for submit button
  },
});

export default PreviousLoans;
