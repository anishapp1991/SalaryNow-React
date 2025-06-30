import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Head from './Header';
import { WebView } from 'react-native-webview';

const GenericScreen = ({ route }) => {
  const { keyName, url } = route.params;
  console.log(url,'hhhh')
  const googleViewerUrl = `https://docs.google.com/viewer?url=${url}&embedded=true`;

  const [loading, setLoading] = useState(true);

  // Handle webview loading events
  const handleLoadStart = () => setLoading(true);
  const handleLoadEnd = () => setLoading(false);

  return (
    <View style={styles.container}>
      <Head title={keyName} />
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <WebView
        source={{ uri: googleViewerUrl }}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        javaScriptEnabled={true} // Enable JS for better rendering
        domStorageEnabled={true} // Enable DOM storage for smoother experience
        setSupportMultipleWindows={false} // Prevent new windows
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
});

export default GenericScreen;
