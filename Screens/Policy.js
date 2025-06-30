import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { WebView } from 'react-native-webview'; // Import WebView
import Head from './Header';

const About = () => {
  // You can replace this URL with the one you want to load in the WebView
  const webviewUrl = 'https://salarynow.in/privacy.html'; // Example URL

  return (
    <View style={styles.container}>
          <Head title="Privacy Policy" />

      {/* WebView component */}
      <WebView 
        source={{ uri: webviewUrl }} 
        style={{ flex: 1 }} // Ensures WebView takes the full screen space
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  container1: {
    flexGrow: 1, // Allow scrolling if content exceeds view height
    paddingHorizontal: 20,
    // paddingBottom: 10,
    marginTop: 15,
  },
});

export default About;
