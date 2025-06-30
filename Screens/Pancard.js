import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import Head from "./Header";
import HTTPRequest from "../utils/HTTPRequest";
import FastImage from "react-native-fast-image";
import RNFS from "react-native-fs";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { RNCamera } from "react-native-camera";
import ImageCropPicker from "react-native-image-crop-picker";

const PreviousLoans = ({ navigation, route }) => {
  const { status } = route.params;
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pre1, setPre1] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const cameraRef = useRef(null); // Reference for RNCamera

  useEffect(() => {
    const fetchPan = async () => {
      try {
        const response = await HTTPRequest.selfie({ doctype: "pan_card" });
        if (response.status === 200) {
          const details = response.data.data.front;
          if (details) {
            setPreviewImage(details);
          }
        } else {
          Alert.alert("Error", "Failed to fetch selfie.");
        }
      } catch (error) {
        console.error("Error fetching selfie:", error);
        Alert.alert("Error", "An error occurred while fetching selfie.");
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "View") {
      setIsLoading(true);
      fetchPan();
    }
  }, [status]);

  const openCustomCamera = async () => {
    const result = await check(PERMISSIONS.ANDROID.CAMERA);
    if (result === RESULTS.GRANTED) {
      setCameraVisible(true);
    } else if (result === RESULTS.DENIED) {
      const requestResult = await request(PERMISSIONS.ANDROID.CAMERA);
      if (requestResult === RESULTS.GRANTED) {
        setCameraVisible(true);
      } else {
        Alert.alert(
          "Permission Denied",
          "You need to grant camera permission to use this feature.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ]
        );
      }
    } else {
      Alert.alert(
        "Camera Permission Blocked",
        "Camera access is blocked. Please enable it in your device settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
    }
  };

  const capturePicture = async () => {
    try {
      if (cameraRef.current) {
        const options = { quality: 0.8, base64: true };
        const data = await cameraRef.current.takePictureAsync(options);

        // Full image capture
        const fullImageUri = data.uri;

        // Manually crop the image after capturing
        const croppedImage = await ImageCropPicker.openCropper({
          path: fullImageUri,
          width: 300,  // Fixed crop width (adjust as needed)
          height: 200, // Fixed crop height (adjust as needed)
          cropping: true, // Enable cropping
          cropperCircleOverlay: false, // Rectangular crop (no circle)
          enableRotation: false, // Disable rotation
          enableScaling: false, // Disable scaling (zooming)
          showGrid: false, // Hide grid for simplicity
          hideBottomControls: true, // Hide controls (rotate, scale, etc.)
          freeStyleCropperEnabled: false, // Disable freestyle crop
          lockAspectRatio: true, // Lock aspect ratio
          avoidEmptySpaceAroundImage: true, // Avoid unnecessary space around image
          cropperToolbarTitle: 'Cropping...', // Custom title for cropper (optional)
          centerCrop: true, // Center crop (keep it fixed)
        });

        // Display the cropped image
        setPreviewImage(croppedImage.path);
        const base64String = await RNFS.readFile(croppedImage.path, "base64");
        setPre1(base64String);
        setCameraVisible(false);
      } else {
        Alert.alert("Error", "Camera is not ready.");
      }
    } catch (error) {
      setCameraVisible(false);
      Alert.alert(" ","You Pressed Back while capturing image.");
    }
  };

  const Submit = async () => {
    if (!previewImage) {
      Alert.alert("Error", "Please upload an image before submitting.");
      return;
    }
  
    const payload = {
      file1: pre1,
      file2: "",
      type: "pan_card",
    };
  
    try {
      setLoading(true);
  
      const response = await HTTPRequest.updatePancard(payload);
      console.log(response.data, 'pan response');
  
      if (response.status === 200 && response.data?.response_status === 1) {
        setLoading(false); // Redundant with finally but ensures it clears before navigation
        navigation.goBack();
      } else {
        setPreviewImage(null);
        setPre1(null);
        Alert.alert("Error", response.data?.response_msg || "Submission failed");
      }
  
    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert("Error", "Network Error. Submit Again.");
    } finally {
      setLoading(false); // This always runs, even on error or success
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
    <View style={styles.container}>
      <Head title="PAN Card" />
      {cameraVisible ? (
        <View style={styles.cameraContainer}>
          <RNCamera
            ref={cameraRef} // Assigning the reference
            style={styles.cardFrame}
            type={RNCamera.Constants.Type.back}
            captureAudio={false}
            // ratio="16:9" // Adjust the ratio to match the frame
          />
          <TouchableOpacity
            style={styles.captureButtonOutside}
            onPress={capturePicture} // Correcting the handler
          >
            <Text style={styles.captureText}>Capture</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.noLoanContainer}>
          <Text style={styles.headerText}>
            {status === "Edit"
              ? "Please Provide the following Information"
              : "Please Check the following Information"}
          </Text>
          <Text style={styles.headerText1}>Upload Photo</Text>

          <TouchableOpacity
            style={styles.dottedBox}
            onPress={status === "Edit" ? openCustomCamera : null}
            disabled={status === "View"}
          >
            {isLoading ? (
              <ActivityIndicator size="large" color="#0288D1" />
            ) : previewImage ? (
              <FastImage
                style={styles.previewImage}
                source={{ uri: previewImage }}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <>
                <FastImage
                  style={styles.chatIcon}
                  source={require("../assests/camera.png")}
                />
                <Text style={styles.noLoanText}>Take Picture</Text>
              </>
            )}
          </TouchableOpacity>

          {status === "Edit" && (
            <TouchableOpacity style={styles.bottomButton} onPress={Submit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  chatIcon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",

  },
  cardFrame: {
    width: 300, // Adjust the size of the frame
    height: 200, // Adjust the size of the frame
    borderColor: "#0288D1",
    borderWidth: 2,
    borderRadius: 10,
    overflow: "hidden", // Ensures camera content is clipped to the frame
  },
  captureButtonOutside: {
    position: "absolute",
    bottom: '22%', // Position at the bottom of the container
    alignSelf: "center",
    backgroundColor: "#0288D1",
    borderRadius: 50,
    padding: 15,
  },
  captureText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dottedBox: {
    width: 300,
    height: 200,
    borderWidth: 2,
    borderColor: "#0288D1",
    borderStyle: "dotted",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 17,
    marginTop: 15,
  },
  noLoanContainer: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 20,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 15,
    fontStyle: "italic",
    marginTop: 25,
    color: "#000",
  },
  headerText1: {
    fontWeight: "bold",
    fontSize: 15,
    fontStyle: "italic",
    marginTop: 25,
    color: "#000",
  },
  noLoanText: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
    fontWeight: "bold",
    marginTop: 10,
  },
  bottomButton: {
    position: "absolute",
    bottom: 20,
    width: "80%",
    padding: 15,
    backgroundColor: "#419fb8",
    borderRadius: 50,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default PreviousLoans;
