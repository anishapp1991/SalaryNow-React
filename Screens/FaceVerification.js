import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Head from './Header';
const FaceVerification = () => {
  const [instructions, setInstructions] = useState("Move your head left");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0); // Track the current instruction step
  const [progress, setProgress] = useState(0); // Progress for the circular indicator
  const previousFacePosition = useRef(null); // Use ref to track previous face position
  const hasMoved = useRef(false); // To track if a movement has already been detected
  const movementHistory = useRef([]); // Store movement history for averaging
  const movementTime = useRef(0); // Time since last movement detection

  // Calibration thresholds
  const movementThreshold = 15; // Fixed threshold for head movement in pixels
  const movementSmoothFactor = 0.7; // Factor to smooth out movements
  const timeThreshold = 300; // Time in ms to allow for movement detection
  const historyLimit = 5; // Number of movements to consider in history

  const handleFacesDetected = async ({ faces }) => {
    try {
      setLoading(true); // Indicate processing

      if (faces.length > 0) {
        const face = faces[0];

        // Extract the coordinates of the face
        const faceX = face.bounds.origin.x;
        const faceWidth = face.bounds.size.width;
        const faceCenterX = faceX + faceWidth / 2; // Calculate the center of the face

        // Initialize previous position if null
        if (previousFacePosition.current === null) {
          previousFacePosition.current = faceCenterX;
          return;
        }

        // Calculate raw movement
        const rawMovement = faceCenterX - previousFacePosition.current;

        // Add raw movement to history
        movementHistory.current.push(rawMovement);
        if (movementHistory.current.length > historyLimit) {
          movementHistory.current.shift(); // Keep only the last movements
        }

        // Calculate smoothed movement
        const smoothedMovement = movementHistory.current.reduce((a, b) => a + b, 0) / movementHistory.current.length;

        // Time check
        const currentTime = new Date().getTime();
        if (movementTime.current === 0) {
          movementTime.current = currentTime;
        }

        // Process movement if time threshold has passed
        if (currentTime - movementTime.current > timeThreshold) {
          if (Math.abs(smoothedMovement) > movementThreshold && !hasMoved.current) {
            // Check movement direction
            if (smoothedMovement < -movementThreshold && step === 0) {
              console.log("Moved left");
              setStep(1);
              setInstructions("Now move your head to the right");
              setProgress(50);
              hasMoved.current = true; // Mark as moved
            } else if (smoothedMovement > movementThreshold && step === 1) {
              console.log("Moved right");
              setStep(2);
              setInstructions("Finally, smile");
              setProgress(100);
              hasMoved.current = true; // Mark as moved
            }
            movementTime.current = currentTime; // Reset time
          }
        }

        previousFacePosition.current = faceCenterX; // Update previous position

        // Check for smiling to complete the process
        if (step === 2 && face.smilingProbability > 0.5) {
          setInstructions("Live Human Detected");
          setProgress(100);
        }
      } else {
        console.log("No face detected, resetting instructions");
        resetInstructions(); // Reset instructions and progress
      }
    } catch (error) {
      console.error("Face detection error: ", error);
    } finally {
      setLoading(false); // Processing complete
    }
  };

  const resetInstructions = () => {
    setInstructions("Move your head left");
    setStep(0); // Reset step when no face is detected
    setProgress(0); // Reset progress
    previousFacePosition.current = null; // Reset previous position
    hasMoved.current = false; // Reset movement tracking
    movementHistory.current = []; // Clear movement history
    movementTime.current = 0; // Reset movement time
  };

  // Reset hasMoved when the step changes to allow new movements
  useEffect(() => {
    if (step === 1 || step === 2) {
      hasMoved.current = false; // Allow for new movement after left/right movement is done
    }
  }, [step]);

  return (
    <View style={styles.container1}>
             <Head title="Face Identification"/>
    <View style={styles.container}>

      <AnimatedCircularProgress
        size={300} // Increased size
        width={20}
        fill={progress}
        tintColor={progress >= 100 ? "#00ff00" : "#00e0ff"}
        backgroundColor="#3d5875"
      >
        {() => (
          <View style={styles.cameraContainer}>
            <RNCamera
              style={styles.camera}
              type={RNCamera.Constants.Type.front}
              onFacesDetected={handleFacesDetected}
              faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.fast}
              faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
              faceDetectionClassifications={RNCamera.Constants.FaceDetection.Classifications.all}
              onCameraReady={() => console.log("Camera is ready")}
              onMountError={(error) => {
                console.error("Camera error: ", error);
                Alert.alert("Camera Error", "Could not access the camera.");
              }}
            />
          </View>
        )}
      </AnimatedCircularProgress>

      <Text style={styles.instructionText}>{instructions}</Text>
      {loading && <Text style={styles.text}>Processing...</Text>}
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container1: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
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
  text: {
    position: 'absolute',
    bottom: 50,
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
  },
  instructionText: {
    position: 'absolute',
    bottom: 10,
    fontSize: 24,
    color: 'blue',
    textAlign: 'center',
    width: '100%',
  },
});

export default FaceVerification;
