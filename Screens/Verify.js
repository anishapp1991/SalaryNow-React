import React, {useState} from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview'; // Import WebView
import Head from './Header';

const Verify = ({Navigation, route}) => {
    const [newUrl, setNewUrl] = useState(route?.params?.verificationUrl || '');
    const [webviewError, setWebviewError] = useState(false);

  return (
    <View style={styles.container}>
          <Head title="OTP based Verification" />
      {/* WebView component */}
      {/* <WebView 
        source={{ uri: newUrl }} 
        style={{ flex: 1 }} // Ensures WebView takes the full screen space
        javaScriptEnabled={true}
        domStorageEnabled={true}
        setSupportMultipleWindows={false} // Prevents opening new windows
      /> */}
         {webviewError ? (
        // Custom Error Screen
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Oops! Something went wrong.</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => setWebviewError(false)} // Retry by resetting error state
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView
          source={{ uri: newUrl }}
          style={{ flex: 1 }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          setSupportMultipleWindows={false} // Prevent new windows
          // onShouldStartLoadWithRequest={(request) => {
          //   // Allow only URLs within your domain
          //   if (request.url.startsWith('https://example.com')) {
          //     return true;
          //   }
          //   return false; // Block other URLs
          // }}
          onError={() => setWebviewError(true)} // Handle general errors
          onHttpError={(syntheticEvent) => {
            const { statusCode } = syntheticEvent.nativeEvent;
            console.log(`HTTP error with status code: ${statusCode}`);
            setWebviewError(true); // Handle HTTP-specific errors
          }}
        />
      )}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Verify;
