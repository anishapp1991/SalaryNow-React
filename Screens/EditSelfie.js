
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, PermissionsAndroid } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Head from './Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HTTPRequest from '../utils/HTTPRequest';
import { RNS3 } from 'react-native-aws3';
import EncryptedStorage from 'react-native-encrypted-storage';
import LottieView from 'lottie-react-native'; // Lottie for animations
import Geolocation from 'react-native-geolocation-service';


const FaceVerification = ({ navigation }) => {
    const cameraRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [keyId, setKeyId] = useState('');
    const [accessKey, setAccessKey] = useState('');
    const [path, setPath] = useState('');
    const [region, setRegion] = useState('');
    const [bucket, setBucket] = useState('');
    const [loading, setLoading] = useState(false);
        const [location, setLocation] = useState({ latitude: '', longitude: '' });
    


    useEffect(() => {
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
   
        const checkLocationPermission = async () => {
             try {
               const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
               // console.log(granted, 'Permission granted');
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
   
       s3Credential();
   
     }, []); // Fetch whenever loanAmount changes
   
   
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
               console.log('Location saved to EncryptedStorage:', { latitude, longitude });
             } catch (error) {
               console.error('Error saving location to EncryptedStorage:', error);
             }
     
           },
           (error) => {
             console.error('Error getting location:', error);
           },
           { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000  } // Increase timeout to 60 seconds
         );
       };



    const takePicture = async () => {
        if (cameraRef.current) {
            const options = { quality: 0.5 };
            const data = await cameraRef.current.takePictureAsync(options);
            console.log("Picture taken", data);
            uploadToS3(data);
            // You can save the image URI or send it for processing
            // navigation.navigate('PanDetails');
        }
    };

    const uploadToS3 = async (image) => {
        console.log('Uploading image:', image);
        const file = {
            uri: image.uri,  // The file URI from camera capture
            name: 'selfie_' + image.uri.split('/').pop(), // File name
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
        setLoading(true);
        try {
            const locationString = await EncryptedStorage.getItem('location');
            // If the item exists, parse the JSON string into an object
            const locations = JSON.parse(locationString);
            const geoResponse = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${locations.latitude},${locations.longitude}&key=AIzaSyBwgZwmXf69ISrlWOe5SY7KtQD7Ic1d6fk`
            );

            if (!geoResponse.ok) {
                throw new Error(`Geocoding error! Status: ${geoResponse.status}`);
            }

            const json = await geoResponse.json();
            const place = json.results?.[0]?.formatted_address || "Address not found";
            var imData = daa.split('/').pop()
            console.log(imData, place, 'jjjjhjj')
            try {
                const selfieResponse = await HTTPRequest.postSelfie({ filename: imData, selfie_location: place });
                if (selfieResponse.status === 200) {
                    console.log('Selfie upload response data:', selfieResponse.data.response_data.kycscreen.page);
                    var nav = selfieResponse.data.response_data.kycscreen.page;
                    navigation.goBack();
                }
            } catch (error) {
                console.error('Error in reverse geocode or upload:', error);
                Alert.alert('Error', `An error occurred: ${error.message}`);
            }

        } catch (error) {
            console.error("Error applying loan:", error);
        } finally {
            setLoading(false); // Stop loading after operation
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
            <Head title="Change Selfie" />
            <View style={styles.container}>
                <Text style={{ fontSize: 18, marginTop: 50, alignItems: 'center' }}>
                    Please keep the face inside the circle
                </Text>
                <View style={{ flex: 1, marginTop: 50, alignItems: 'center' }}>
                    <AnimatedCircularProgress
                        size={250} // Increased size
                        width={10}
                        fill={progress}
                        tintColor={progress >= 100 ? "#00ff00" : "#00e0ff"}
                        backgroundColor="#3d5875"
                    >
                        {() => (
                            <View style={styles.cameraContainer}>
                                <RNCamera
                                    ref={cameraRef}
                                    style={styles.camera}
                                    type={RNCamera.Constants.Type.front}
                                    onCameraReady={() => console.log("Camera is ready")}
                                    onMountError={(error) => {
                                        console.error("Camera error: ", error);
                                        Alert.alert("Camera Error", "Could not access the camera.");
                                    }}
                                />
                            </View>
                        )}
                    </AnimatedCircularProgress>

                    <TouchableOpacity style={styles.button} onPress={takePicture}>
                        <View style={styles.iconWrapper}>
                            <View style={styles.circle}>
                                <Ionicons name={"camera"} size={40} color={'#fff'} />
                            </View>
                            <Text style={styles.buttonText}>Take a Selfie</Text>

                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container1: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        // backgroundColor:'transparent',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        width: '100%',
        marginTop: 50,
    },
    iconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    circle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#419fb8',
        alignItems: 'center',
        justifyContent: 'center',
        // marginBottom: 10,
    },
    cameraIcon: {
        width: 40,
        height: 40,
    },
    buttonText: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
        marginTop: 10,
    },
    container: {
        flex: 1,
        alignItems: 'center',
    },
    cameraContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',

    },
    camera: {
        flex: 1,
        width: '100%',
        height: '100%',


    },
});

export default FaceVerification;
